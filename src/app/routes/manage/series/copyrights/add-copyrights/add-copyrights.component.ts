import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ReactiveBase, FormControlService, TreeService, MessageService, Util, ScrollService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { CopyrightsService } from '../copyrights.service';
import { RootTemplateDto, ContractDto } from '../dtos';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { FieldCalcGroup, FieldMultiplyCalcGroup, FieldAdditionCalcGroup } from '../field-calc';
import { SeriesService } from '../../series.service';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-copyrights',
  templateUrl: './add-copyrights.component.html',
  styles: [`
    .block-operations {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      // background-color: #e6f7ff;
    }
  `]
})
export class AddCopyrightsComponent implements OnInit, OnDestroy {

  @ViewChild('contractFormRef') contractFormRef: ElementRef<HTMLFormElement>;
  @ViewChild('paymentFormRef') paymentFormRef: ElementRef<HTMLFormElement>;
  @ViewChild('rightFormRef') rightFormRef: ElementRef<HTMLFormElement>;

  tab: number;
  series: any[];
  customerOptions: any[];
  filteredCustomerOptions: string[];
  areaTemplates: RootTemplateDto[];
  rightTemplates: RootTemplateDto[];
  rightChildrenTemplate = {};
  typeForm: FormGroup;
  contractForm: FormGroup;
  paymentForm: FormGroup;
  rightForm: FormGroup;
  payments: ReactiveBase<any>[][];
  indeterminate = false;
  checkOptions: any;
  dataSet = [];
  isSaving: boolean;
  isSaved = false;
  programOfOptions = [];
  fieldCalcGroups: FieldCalcGroup[];
  programTypeOptions: string[];
  filteredProgramTypes: string[];
  programThemeOptions: string[];
  filteredProgramThemes: string[];
  isVerify: number;
  review_ids = [];
  pids: any;
  ids: any;
  proIds = '';
  constructor(
    private fb: FormBuilder,
    private service: CopyrightsService,
    private ss: SeriesService,
    private fcs: FormControlService,
    private ts: TreeService,
    private translate: TranslateService,
    private message: MessageService,
    private scroll: ScrollService,
    private route: ActivatedRoute,
    private modal: NzModalService,
  ) { }

  get contract() {
    return this.typeForm.get('contract').value;
  }

  get projects() {
    return this.rightForm.get('projects') as FormControl;
  }

  get projectsAllChecked() {
    return this.rightForm.get('projectsAllChecked') as FormControl;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.isVerify = param.get('isVerify') as any;
      // 节目id
      this.pids = param.get('pids') as any;
      // 审片id
      this.proIds = param.get('ids') as any;
      if (this.pids) {
        this.fetchProgramOfOptions(this.pids);
      }
    });
    this.service.getCustomerOptions().subscribe(result => {
      this.customerOptions = result.list;
      this.filteredCustomerOptions = result.list.map(c => c.name);
    });

    this.service.getCopyrightTemplates().subscribe(result => {
      result.forEach(item => {
        this.rightChildrenTemplate[item.code] = item.children;
        delete item.children;
      });
      if (result) {
        this.service.setLeafNode(result);
      }
      this.rightTemplates = result;
    });

    this.service.getCopyrightAreaOptions().subscribe(result => {
      if (result) {
        this.service.setLeafNode(result);
      }
      this.areaTemplates = result;
    });

    this.ss.getProgramTypes().subscribe(result => {
      this.filteredProgramTypes = this.programTypeOptions = result.program_type_choices;
      this.filteredProgramThemes = this.programThemeOptions = result.theme_choices;
    });

    this.typeForm = this.fb.group({
      investmentType: ['homemade', [Validators.required]],
      contract: ['no', Validators.required]
    });

    this.contractForm = this.fb.group({
      customer: [null, [Validators.required]],
      totalAmount: [null, [Validators.pattern(/^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/)]],
      paymentMethod: [null],
      contractName: [null],
      contractNumber: [null],
      signDate: [new Date(), Validators.required],
      totalEpisodes: [null],        // 总集数
      episodePrice: [null],         // 每集单价
      totalEpisodesPrice: [null],   // 节目费总计
      tapeMailPrice: [null],        // 磁复邮单价
      totalTapeMailPrice: [null],   // 磁复邮总计
      chargePerson: [null]          // 经办人
    });

    this.rightForm = this.fb.group({
      programType: [null, [Validators.required]],
      programTheme: [null],
      projects: [null, [Validators.required]],
      copyright: [null, [Validators.required]],
      copyrightChildren: [null],
      copyrightIsSole: [false],
      copyrightNote: [null],
      copyrightArea: [null, [Validators.required]],
      copyrightAreaNote: [null],
      copyrightValidTerm: [null],
      copyrightValidTermIsPermanent: [false],
      copyrightValidTermNote: [null],
      broadcastChannel: [null],
      airDate: [null],
      note: [null]
    });

    this.fieldCalcGroups = [];

    const episodeFields = this.getContractFormFields('totalEpisodes', 'episodePrice', 'totalEpisodesPrice');
    this.fieldCalcGroups.push(new FieldMultiplyCalcGroup(episodeFields[0], episodeFields[1], episodeFields[2]));

    const tapeMailFields = this.getContractFormFields('totalEpisodes', 'tapeMailPrice', 'totalTapeMailPrice');
    this.fieldCalcGroups.push(new FieldMultiplyCalcGroup(tapeMailFields[0], tapeMailFields[1], tapeMailFields[2]));

    const amountFields = this.getContractFormFields('totalEpisodesPrice', 'totalTapeMailPrice', 'totalAmount');
    this.fieldCalcGroups.push(new FieldAdditionCalcGroup(amountFields[0], amountFields[1], amountFields[2]));
  }

  ngOnDestroy(): void {
    this.fieldCalcGroups.forEach(item => item.ngOnDestroy());
  }

  getContractFormFields(...keys: string[]) {
    return keys.map(k => this.contractForm.get(k) as FormControl);
  }

  onCustomerInput(value: string) {
    this.filteredCustomerOptions = this.customerOptions.filter(item => item.name.indexOf(value) >= 0).map(item => item.name);
  }

  onRightChange() {
    this.rightForm.get('copyrightChildren').reset();
  }

  onProgramTypeInput(value: string) {
    this.filteredProgramTypes = this.programTypeOptions.filter(item => item.indexOf(value) >= 0);
  }

  onProgramThemeInput(value: string) {
    this.filteredProgramThemes = this.programThemeOptions.filter(item => item.indexOf(value) >= 0);
  }
  // 获取节目信息
  fetchProgramOfOptions(ids?: number[]) {
    this.service.getSeriesNames(ids).subscribe(result => {
      this.programOfOptions = result.list;
      if (ids) {
        this.rightForm.get('projects').setValue(this.programOfOptions.map(p => p.name));
        this.rightForm.get('programType').setValue(this.programOfOptions.map(p => p.program_type));
        this.rightForm.get('programTheme').setValue(this.programOfOptions.map(p => p.theme === null ? '无' : p.theme));
      }
      if (ids && Number(this.isVerify) === 1) {
        this.rightForm.get('programType').disable();
        this.rightForm.get('projects').disable();
        this.rightForm.get('programTheme').disable();
      }
    });
  }

  seriesTagChange(event: { checked: boolean, tag: any }) {
    event.tag.status = event.checked;
    const selected = this.series ? this.series.filter(e => e.status) : [];
    this.checkOptions = selected.map(item => ({ label: item.name, value: item.id, checked: true, episodes: item.episodes }));
    this.projects.setValue(this.checkOptions);
  }

  updateAllChecked() {
    this.indeterminate = false;
    if (this.projectsAllChecked.value) {
      this.checkOptions.forEach(item => item.checked = true);
    } else {
      this.checkOptions.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked() {
    if (this.checkOptions.every(item => item.checked === false)) {
      this.projectsAllChecked.setValue(false);
      this.indeterminate = false;
    } else if (this.checkOptions.every(item => item.checked === true)) {
      this.projectsAllChecked.setValue(true);
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  next() {
    this.tab = 1;
  }

  onPaymentMethodChange(value: string) {
    const count = parseInt(value, 10);
    if (count >= 0) {
      this.payments = this.service.getCopyrightPaymentReactives(count);
      this.payments[count - 1].find(item => item.key.startsWith('money')).readonly = true;
      const fg = {};
      this.payments.map(p => this.fcs.toFormGroup(p)).forEach(p => {
        const c = p.controls;
        for (const key in c) {
          if (c.hasOwnProperty(key)) {
            fg[key] = c[key];
          }
        }
      });
      this.paymentForm = this.fb.group(fg);
      this.setAmounts();
    }
  }

  validationForm(form: FormGroup) {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  resetCopyrightForm() {
    this.rightForm.reset();
  }

  addList() {
    if (this.validationForm(this.rightForm)) {
      const checkedRights = this.rightForm.get('copyright').value as Array<any>;
      const right = this.ts.recursionNodesFindBy(this.rightTemplates, node => node.code === checkedRights[checkedRights.length - 1]);
      const checkedAreas = this.rightForm.get('copyrightArea').value as Array<any>;
      const area = this.ts.recursionNodesFindBy(this.areaTemplates, node => node.code === checkedAreas[checkedAreas.length - 1]);
      const term = this.rightForm.get('copyrightValidTerm').value;
      let children: RootTemplateDto[];
      const rightChildren = this.rightForm.get('copyrightChildren').value as string[];
      if (rightChildren) {
        children = rightChildren.map(child => this.rightChildrenTemplate[right.code].find((item: RootTemplateDto) => item.code === child));
      }
      let startDate: any, endDate: any;
      if (term) {
        startDate = term[0];
        endDate = term[1];
      }
      const list = this.projects.value.map(name => {
        const program = this.programOfOptions.find(item => item.name === name);
        return {
          id: program ? program.id : null,
          name: name,
          type: program ? program.program_type : this.rightForm.get('programType').value,
          theme: this.rightForm.get('programTheme').value,
          // episodes: item.episodes,
          right: right.code,
          rightChildren: children ? children.map(c => c.code) : null,
          area: area.code,
          term: term,
          termIsPermanent: this.rightForm.get('copyrightValidTermIsPermanent').value,
          note: this.rightForm.get('note').value,
          rightNote: this.rightForm.get('copyrightNote').value,
          areaNote: this.rightForm.get('copyrightAreaNote').value,
          termNote: this.rightForm.get('copyrightValidTermNote').value,
          broadcastChannel: this.rightForm.get('broadcastChannel').value,
          airDate: this.rightForm.get('airDate').value,
          displayRight: right.name,
          displayArea: area.name,
          displayRightChildren: children ? children.map(c => c.name) : null,
          termStartDate: startDate,
          termEndDate: endDate
        };
      });
      this.dataSet = [...this.dataSet, ...list];
    } else {
      this.scroll.scrollToElement(this.rightFormRef.nativeElement, -20);
    }
  }

  resetList() {
    this.dataSet = [];
  }

  hasContract() {
    return this.typeForm.get('contract').value === 'yes';
  }

  save() {
    if (this.hasContract()) {
      if (this.validationForm(this.contractForm)) {
        if (this.paymentForm) {
          if (this.validationForm(this.paymentForm)) {
            if (this.dataSet.length > 0) {
              this.saveCopyrights(true);
            } else {
              this.message.warning('请先"添加"');
            }
          } else {
            this.scroll.scrollToElement(this.paymentFormRef.nativeElement, -20);
          }
        } else {
          if (this.dataSet.length > 0) {
            this.saveCopyrights(true);
          } else {
            this.message.warning('请先"添加"');
          }
        }
      } else {
        this.scroll.scrollToElement(this.contractFormRef.nativeElement, -20);
      }
    } else {
      if (this.dataSet.length > 0) {
        this.saveCopyrights(false);
      } else {
        this.message.warning('请先"添加"');
      }
    }
  }

  saveCopyrights(hasContract: boolean) {
    this.isSaving = true;
    let contract = {} as ContractDto, orders = null, programs = null;

    if (hasContract) {
      contract = {
        custom_name: this.contractForm.value['customer'],
        sign_date: Util.dateToString(this.contractForm.value['signDate']),
        contract_number: this.contractForm.value['contractNumber'],
        contract_name: this.contractForm.value['contractName'],
        total_episodes: this.contractForm.value['totalEpisodes'],
        charge_person: this.contractForm.value['chargePerson'],
        episode_price: this.contractForm.value['episodePrice'],
        total_episodes_price: this.contractForm.value['totalEpisodesPrice'],
        tape_mail_price: this.contractForm.value['tapeMailPrice'],
        total_tape_mail_price: this.contractForm.value['totalTapeMailPrice'],
        total_amount: this.contractForm.value['totalAmount'],
        remark: null
      };

      if (this.payments) {
        orders = this.payments.map(paymentObjArr => {
          const arr = paymentObjArr.map(item => this.paymentForm.value[item.key]);
          return this.service.toOrderData(+arr[1], Util.dateToString(arr[0]), arr[3]); // 来自页面字段顺序
        });
      }
    }

    const groupData = this.service.groupBy(this.dataSet, item => item.id);
    const nullId = groupData.find(item => item[0].id === null);
    if (nullId) {
      groupData.splice(groupData.indexOf(nullId), 1);
      this.service.groupBy(nullId, item => item.name).forEach(item => groupData.push(item));
    }
    programs = groupData.map(group => {
      const first = group[0];
      const program = this.service.toProgramData(
        first.id,
        first.name,
        first.type,
        first.theme,
        first.episodes,
        this.typeForm.value['investmentType'],
        group.map(item => {
          return this.service.toCopyrightData(
            null,
            item.right,
            item.rightChildren,
            item.rightNote,
            item.area,
            item.areaNote,
            item.termIsPermanent,
            Util.dateToString(item.termStartDate),
            Util.dateToString(item.termEndDate),
            item.termNote,
            item.note,
            item.broadcastChannel,
            Util.dateToString(item.airDate));
        })
      );
      return program;
    });

    if (programs.length > 0) {
      // 新增版权三审入口
      if (Number(this.isVerify) === 1) {
        this.review_ids = this.proIds.split(',');
        this.review_ids = this.review_ids.map(Number);
        this.service.addFilmCopyrights(contract, orders, programs, this.review_ids)
          .pipe(finalize(() => this.isSaving = false))
          .subscribe(result => {
            this.isSaved = true;
            this.dataSet = [];
            if (this.paymentForm) {
              this.paymentForm.reset();
            }
            this.contractForm.reset();
            this.payments = null;
            // this.fetchProgramOfOptions();
            this.message.success(this.translate.instant('global.save-successfully'));
          });
      } else {
        // 新增版权入口
        this.service.addCopyrights(this.service.toAddCopyrightsData(contract, orders, programs))
          .pipe(finalize(() => this.isSaving = false))
          .subscribe(result => {
            this.isSaved = true;
            this.dataSet = [];
            if (this.paymentForm) {
              this.paymentForm.reset();
            }
            this.contractForm.reset();
            this.payments = null;
            // this.fetchProgramOfOptions();
            this.message.success(this.translate.instant('global.save-successfully'));
          });
      }
    } else {
      this.isSaving = false;
    }
  }

  deleteRight(item: any) {
    this.dataSet = this.dataSet.filter(d => d !== item);
  }

  onMoneyChange(value: string, key: string) {
    this.setAmounts();
  }

  onTotalAmountChange(value: string) {
    if (!this.paymentForm) {
      return;
    }
    this.setAmounts();
  }

  setAmounts() {
    let hasValue = true;
    const allKeys = _.flatten(this.payments).filter(item => item.key.startsWith('money')).map(item => item.key);
    const lastKey = allKeys[allKeys.length - 1];
    allKeys.filter(item => item !== lastKey).forEach(item => {
      const field = this.paymentForm.get(item);
      if (!(typeof field.value === 'string' && field.value.length > 0 && field.valid)) {
        hasValue = false;
      }
    });
    if (hasValue) {
      let otherTotalValue = 0;
      allKeys.filter(item => item !== lastKey).forEach(item => otherTotalValue += +this.paymentForm.value[item]);
      const lastField = this.paymentForm.get(lastKey) as FormControl;
      const lastValue = +this.contractForm.value['totalAmount'] - otherTotalValue;
      const totalAountField = this.contractForm.get('totalAmount');
      if (lastValue < 0) {
        totalAountField.setErrors({ totalInvalid: true });
      } else {
        totalAountField.markAsDirty();
        totalAountField.updateValueAndValidity();
      }
      lastField.setValue(lastValue, { emitViewToModelChange: false });
      lastField.markAsDirty();
      lastField.updateValueAndValidity();
      allKeys.forEach(item => {
        const percentKey = 'percent' + _.trimStart(item, 'money');
        const percent = (+this.paymentForm.value[item] / +this.contractForm.value['totalAmount']) * 100;
        this.paymentForm.get(percentKey).setValue(_.floor(percent, 2) + '%');
      });
    }
  }
}
