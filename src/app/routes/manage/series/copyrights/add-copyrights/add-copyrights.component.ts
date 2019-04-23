import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ReactiveBase, FormControlService, TreeService, MessageService, Util } from '@shared';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { CopyrightsService } from '../copyrights.service';
import { RootTemplateDto } from '../dtos';
import { ScrollService } from '@shared';
import * as _ from 'lodash';

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
export class AddCopyrightsComponent implements OnInit {

  @ViewChild('contractFormRef') contractFormRef: ElementRef<HTMLFormElement>;
  @ViewChild('paymentFormRef') paymentFormRef: ElementRef<HTMLFormElement>;
  tab: number;
  series: any[];
  customerOptions: any[];
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

  constructor(
    private fb: FormBuilder,
    private service: CopyrightsService,
    private fcs: FormControlService,
    private ts: TreeService,
    private translate: TranslateService,
    private message: MessageService,
    private scroll: ScrollService
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
    this.service.getCustomerOptions().subscribe(result => {
      this.customerOptions = result.list;
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

    this.fetchProgramOfOptions();

    this.typeForm = this.fb.group({
      investmentType: ['homemade', [Validators.required]],
      contract: ['no', Validators.required]
    });

    this.contractForm = this.fb.group({
      customer: [null, [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.pattern(/^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/)]],
      paymentMethod: [null, [Validators.required]],
      contractName: [null],
      contractNumber: [null, [Validators.required]],
      signDate: [new Date(), Validators.required]
    });

    this.rightForm = this.fb.group({
      programType: ['other', [Validators.required]],
      projects: [null, [Validators.required]],
      copyright: [null, [Validators.required]],
      copyrightChildren: [null],
      copyrightIsSole: [false],
      copyrightNote: [null],
      copyrightArea: [null, [Validators.required]],
      copyrightAreaNote: [null],
      copyrightValidTerm: [null, [Validators.required]],
      copyrightValidTermIsPermanent: [false],
      copyrightValidTermNote: [null],
      note: [null]
    });
  }

  onRightChange() {
    this.rightForm.get('copyrightChildren').reset();
  }

  fetchProgramOfOptions() {
    this.service.getPrograms().subscribe(result => {
      this.programOfOptions = result.list;
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
          displayRight: right.name,
          displayArea: area.name,
          displayRightChildren: children ? children.map(c => c.name) : null,
          termStartDate: startDate,
          termEndDate: endDate
        };
      });
      this.dataSet = [...this.dataSet, ...list];
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
      const contract = this.validationForm(this.contractForm);
      const payment = this.paymentForm ? this.validationForm(this.paymentForm) : false;
      if (contract && payment && this.dataSet.length > 0) {
        this.saveCopyrights(true);
      } else {
        if (!contract) {
          this.scroll.scrollToElement(this.contractFormRef.nativeElement, -20);
        } else {
          if (!payment) {
            this.scroll.scrollToElement(this.paymentFormRef.nativeElement, -20);
          } else {
            if (this.dataSet.length < 1) {
              this.message.warning('请先添加待新增权利');
            }
          }
        }
      }
    } else {
      if (this.dataSet.length > 0) {
        this.saveCopyrights(false);
      } else {
        this.message.warning('请先添加待新增权利');
      }
    }
  }

  saveCopyrights(hasContract: boolean) {
    this.isSaving = true;
    let contract = null, orders = null, programs = null;

    if (hasContract) {
      contract = this.service.toContractData(
        this.contractForm.value['contractNumber'],
        this.contractForm.value['contractName'],
        null,
        this.contractForm.value['customer'],
        Util.dateToString(this.contractForm.value['signDate']));

      orders = this.payments.map(paymentObjArr => {
        const arr = paymentObjArr.map(item => this.paymentForm.value[item.key]);
        return this.service.toOrderData(+arr[1], Util.dateToString(arr[0]), arr[3]); // 来自页面字段顺序
      });
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
            item.note);
        })
      );
      return program;
    });

    if (programs.length > 0) {
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
          this.fetchProgramOfOptions();
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
