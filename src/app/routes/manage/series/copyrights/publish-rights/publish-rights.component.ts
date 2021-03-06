import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReactiveBase, FormControlService, TreeService, MessageService, Util, ScrollService, SeriesSelectorComponent } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { finalize, switchMap, zip, catchError } from 'rxjs/operators';
import { CopyrightsService } from '../copyrights.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RootTemplateDto, ContractDto } from '../dtos';
// import { ScrollService } from '@delon/theme';
import * as _ from 'lodash';
import { Observable, merge, of, throwError } from 'rxjs';
import { FieldCalc, MultiplyCalcMethod, FieldMultiplyCalcGroup, FieldAdditionCalcGroup, FieldCalcGroup } from '../field-calc';
import { NzDrawerService } from 'ng-zorro-antd';

@Component({
  selector: 'app-publish-rights',
  templateUrl: './publish-rights.component.html',
  styles: [`
    .block-operations {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
      // background-color: #e6f7ff;
    }
  `]
})
export class PublishRightsComponent implements OnInit, OnDestroy {

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
  contractForm: FormGroup;
  paymentForm: FormGroup;
  rightForm: FormGroup;
  payments: ReactiveBase<any>[][];
  indeterminate = false;
  checkOptions: any;
  dataSet = [];
  isSaving: boolean;
  isSaved = false;
  fieldCalcGroups: FieldCalcGroup[];

  constructor(
    private fb: FormBuilder,
    private service: CopyrightsService,
    private fcs: FormControlService,
    private ts: TreeService,
    private translate: TranslateService,
    private message: MessageService,
    private route: ActivatedRoute,
    private scroll: ScrollService,
    private drawer: NzDrawerService,
    private injector: Injector
  ) { }

  get projects() {
    return this.rightForm.get('projects') as FormControl;
  }

  get projectsAllChecked() {
    return this.rightForm.get('projectsAllChecked') as FormControl;
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const pids = params.get('pids') as any;
        if (pids != null) {
          return this.service.getSeriesNames(pids);
        }
        return throwError({});
      })
    ).subscribe(result => {
      this.series = result.list;
      this.checkOptions = this.series.map(item => ({ label: item.name, value: item.id, checked: true }));
      this.projects.setValue(this.checkOptions);
    }, () => {
      this.selectSeries();
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

    this.contractForm = this.fb.group({
      customer: [null, [Validators.required]],
      totalAmount: [null, [Validators.pattern(/^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/)]], // '[0-9]*(/.[0-9]{1,2})?'
      paymentMethod: [null],
      contractName: [null],
      contractNumber: [null],
      signDate: [new Date(), Validators.required],
      totalEpisodes: [null],        // ?????????
      episodePrice: [null],         // ????????????
      totalEpisodesPrice: [null],   // ???????????????
      tapeMailPrice: [null],        // ???????????????
      totalTapeMailPrice: [null],   // ???????????????
      chargePerson: [null]          // ?????????
    });

    this.rightForm = this.fb.group({
      projects: [null],
      projectsAllChecked: [true],
      copyright: [null, [Validators.required]],
      copyrightChildren: [null],
      copyrightIsSole: [false],
      copyrightNote: [null],
      copyrightArea: [null, [Validators.required]],
      copyrightAreaNote: [null],
      copyrightValidTerm: [null],
      copyrightValidTermIsPermanent: [false],
      copyrightValidTermNote: [null],
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

  selectSeries() {
    const drawerRef = this.drawer.create({
      nzTitle: '????????????',
      nzContent: SeriesSelectorComponent,
      nzWidth: 600
    });
    drawerRef.afterClose.subscribe(result => {
      if (result && result.length > 0) {
        this.series = result;
        this.checkOptions = this.series.map(item => ({ label: item.name, value: item.id, checked: true }));
        this.projects.setValue(this.checkOptions);
      }
    });
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
      this.payments = this.service.getPublishRightsPaymentReactives(count);
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

  addList() {
    if (this.validationForm(this.rightForm)) {
      const checkedRights = this.rightForm.get('copyright').value as string[];
      const right = this.ts.recursionNodesFindBy(this.rightTemplates, node => node.code === checkedRights[checkedRights.length - 1]);
      const checkedAreas = this.rightForm.get('copyrightArea').value as string[];
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
      const list = this.projects.value.filter(item => item.checked).map(item => {
        return {
          id: item.value,
          name: item.label,
          episodes: item.episodes,
          right: right.code,
          rightChildren: children ? children.map(c => c.code) : null,
          isSole: this.rightForm.get('copyrightIsSole').value,
          area: area.code,
          term: term,
          termIsPermanent: this.rightForm.get('copyrightValidTermIsPermanent').value,
          note: this.rightForm.get('note').value,
          rightNote: this.rightForm.get('copyrightNote').value,
          areaNote: this.rightForm.get('copyrightAreaNote').value,
          termNote: this.rightForm.get('copyrightValidTermNote').value,
          displayRight: right.name,
          displayArea: area.name,
          displayRightChildren: children ? children.map(c => c.name) : null,
          termStartDate: startDate,
          termEndDate: endDate,
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

  save() {
    if (this.validationForm(this.contractForm)) {
      if (this.paymentForm) {
        if (this.validationForm(this.paymentForm)) {
          if (this.dataSet.length > 0) {
            this.saveCopyrights(true);
          } else {
            this.message.warning('??????"??????"');
          }
        } else {
          this.scroll.scrollToElement(this.paymentFormRef.nativeElement, -20);
        }
      } else {
        if (this.dataSet.length > 0) {
          this.saveCopyrights(true);
        } else {
          this.message.warning('??????"??????"');
        }
      }
    } else {
      this.scroll.scrollToElement(this.contractFormRef.nativeElement, -20);
    }
  }

  saveCopyrights(hasContract: boolean) {
    this.isSaving = true;
    let contract = {} as ContractDto, orders = [], programs = null;

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
          return this.service.toOrderData(+arr[1], Util.dateToString(arr[0]), arr[3]); // ????????????????????????
        });
      }
    }

    const groupData = this.service.groupBy(this.dataSet, item => item.id);
    programs = groupData.map(group => {
      const first = group[0];
      const program = this.service.toPubProgramData(
        first.id,
        first.name,
        first.type,
        first.episodes,
        group.map(item => {
          return this.service.toCopyrightData(
            item.isSole,
            item.right,
            item.rightChildren,
            item.rightNote,
            item.area,
            item.areaNote,
            item.termIsPermanent,
            Util.dateToString(item.termStartDate),
            Util.dateToString(item.termEndDate),
            item.termNote,
            item.note);
        })
      );
      return program;
    });

    if (programs.length > 0) {
      this.service.publishRights(this.service.toPublishRightsData(contract, orders, programs))
        .pipe(finalize(() => this.isSaving = false))
        .subscribe(result => {
          this.isSaved = true;
          this.dataSet = [];
          if (this.paymentForm) {
            this.paymentForm.reset();
          }
          this.contractForm.reset();
          this.payments = null;
          this.message.success(this.translate.instant('global.save-successfully'));
        });
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
