import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ReactiveBase, FormControlService, TreeService, MessageService, Util } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { finalize, switchMap } from 'rxjs/operators';
import { CopyrightsService } from '../copyrights.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as _ from 'lodash';

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
export class PublishRightsComponent implements OnInit {

  tab: number;
  series: any[];
  customerOptions: any[];
  areaTemplates: any[];
  rightTemplates: any[];
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

  constructor(
    private fb: FormBuilder,
    private service: CopyrightsService,
    private fcs: FormControlService,
    private ts: TreeService,
    private translate: TranslateService,
    private message: MessageService,
    private route: ActivatedRoute,
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
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const pids = params.get('pids');
        return  this.service.getSeriesNames(pids);
      })
    ).subscribe(result => {
      this.series = result.list;
      this.checkOptions = this.series.map(item => ({ label: item.name, value: item.id, checked: true }));
      this.projects.setValue(this.checkOptions);
    });

    this.service.getCustomerOptions().subscribe(result => {
      this.customerOptions = result.list;
    });

    this.service.getCopyrightTemplates().subscribe(result => {
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

    this.typeForm = this.fb.group({
      // investmentType: ['homemade', [Validators.required]],
      contract: ['yes', Validators.required]
    });

    this.contractForm = this.fb.group({
      customer: [null, [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.pattern(/^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/)]], // '[0-9]*(/.[0-9]{1,2})?'
      paymentMethod: [null, [Validators.required]],
      payments: this.fb.array([]),
      contractName: [null],
      contractNumber: [null, [Validators.required]],
      signDate: [new Date(), Validators.required]
    });

    this.rightForm = this.fb.group({
      projects: [null],
      projectsAllChecked: [true],
      copyright: [null, [Validators.required]],
      copyrightNote: [null],
      copyrightArea: [null, [Validators.required]],
      copyrightAreaNote: [null],
      copyrightValidTerm: [null],
      copyrightValidTermIsPermanent: [false],
      copyrightValidTermNote: [null],
      note: [null]
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
    this.payments = this.service.getPublishRightsPaymentReactives(count);
    this.payments[count - 1].find(item => item.key.startsWith('money')).disabled = true;
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
      let startDate, endDate;
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
          area: area.code,
          term: term,
          termIsPermanent: this.rightForm.get('copyrightValidTermIsPermanent').value,
          note: this.rightForm.get('note').value,
          rightNote: this.rightForm.get('copyrightNote').value,
          areaNote: this.rightForm.get('copyrightAreaNote').value,
          termNote: this.rightForm.get('copyrightValidTermNote').value,
          displayRight: right.name,
          displayArea: area.name,
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
      const payment = this.paymentForm ? this.validationForm(this.paymentForm) : null;
      if (contract && payment) {
        this.saveCopyrights(true);
      }
    } else {
      this.saveCopyrights(false);
    }
  }

  saveCopyrights(hasContract: boolean) {
    this.isSaving = true;
    let contract = {} as any, orders = [], programs = null;

    if (hasContract) {
      contract = this.service.toContractData(
        this.contractForm.value['contractNumber'],
        this.contractForm.value['contractName'],
        null,
        this.contractForm.value['customer'],
        Util.dateToString(this.contractForm.value['signDate']));

      orders = this.payments.map(paymentObjArr => {
        const arr = paymentObjArr.map(item => this.paymentForm.value[item.key]);
        return this.service.toOrderData(+arr[1], Util.dateToString(arr[0]), arr[2]); // 来自页面字段顺序
      });
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
            item.right,
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
    let originKey: string;
    for (let index = 0; index < this.payments.length; index++) {
      if (key.endsWith(index + '')) {
        originKey = _.trimEnd(key, index + '');
        break;
      }
    }
    let hasValue = true;
    const allKeys = _.flatten(this.payments).filter(item => item.key.startsWith(originKey)).map(item => item.key);
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
      console.log(otherTotalValue);
      const lastField = this.paymentForm.get(lastKey);
      const lastValue = +this.contractForm.value['totalAmount'] - otherTotalValue;
      if (lastValue < 0) {
        this.contractForm.get('totalAmount').setErrors({ totalInvalid: true }, { emitEvent: false });
        console.log(+this.contractForm.value['totalAmount'], this.contractForm.get('totalAmount').errors);
      }
      lastField.setValue(lastValue, { onlySelf: true, emitEvent: false, emitViewToModelChange: false });
    }
    console.log(value, key, originKey, hasValue);
  }

  onTotalAmountChange(value: string) {
    console.log(value, 'total amount');
    if (!this.paymentForm) {
      return;
    }
    const allKeys = _.flatten(this.payments).map(item => item.key);
    const lastKey = allKeys[allKeys.length - 1];
    let hasValue = true;
    allKeys.filter(item => item !== lastKey).forEach(item => {
      const field = this.paymentForm.get(item);
      if (!(typeof field.value === 'string' && field.value.length > 0 && field.valid)) {
        hasValue = false;
      }
    });
    if (hasValue) {
      let otherTotalValue = 0;
      allKeys.filter(item => item !== lastKey).forEach(item => otherTotalValue += +this.paymentForm.value[item]);
      const lastField = this.paymentForm.get(lastKey);
      const lastValue = +value - otherTotalValue;
      if (lastValue < 0) {
        this.contractForm.get('totalAmount').setErrors({ totalInvalid: true });
        console.log(this.contractForm.get('totalAmount').errors);
      }
      lastField.setValue(lastValue, { onlySelf: true, emitEvent: false, emitViewToModelChange: false });
    }
  }

}
