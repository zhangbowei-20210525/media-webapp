import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AddCopyrightsService } from './add-copyrights.service';
import { ReactiveBase, FormControlService, TreeService, MessageService } from '@shared';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-copyrights',
  templateUrl: './add-copyrights.component.html',
  styleUrls: ['./add-copyrights.component.less']
})
export class AddCopyrightsComponent implements OnInit {

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

  constructor(
    private fb: FormBuilder,
    private service: AddCopyrightsService,
    private fcs: FormControlService,
    private ts: TreeService,
    private translate: TranslateService,
    private message: MessageService
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
      investmentType: ['homemade', [Validators.required]],
      contract: ['no', Validators.required]
    });

    this.contractForm = this.fb.group({
      customer: [null, [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.pattern('[0-9]*(/.[0-9]{1,2})?')]],
      paymentMethod: [null, [Validators.required]],
      payments: this.fb.array([]),
      contractName: [null, [Validators.required]],
      contractNumber: [null, [Validators.required]]
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
    this.payments = this.service.getCopyrightPaymentReactives(count);
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

  getDatePipe() {
    return new DatePipe('zh-CN');
  }

  formatDate(pipe: DatePipe, date: Date) {
    return date ? pipe.transform(date, 'yyyy-MM-dd') : null;
  }

  hasContract() {
    return this.typeForm.get('contract').value === 'yes';
  }

  save() {
    if (this.hasContract()) {
      const contract = this.validationForm(this.contractForm);
      const payment = this.validationForm(this.paymentForm);
      if (contract && payment) {
        this.saveCopyrights(true);
      }
    } else {
      this.saveCopyrights(false);
    }
  }

  saveCopyrights(hasContract: boolean) {
    const datePipe = this.getDatePipe();
    let contract = null, orders = null, programs = null;

    if (hasContract) {
      contract = this.service.toContractData(
        this.contractForm.value['contractNumber'],
        this.contractForm.value['contractName'],
        null,
        this.contractForm.value['customer']);

      orders = this.payments.map(paymentObjArr => {
        const arr = paymentObjArr.map(item => this.paymentForm.value[item.key]);
        return this.service.toOrderData(+arr[1], this.formatDate(datePipe, arr[0]), arr[2]); // 来自页面字段顺序
      });
    }

    const groupData = this.service.groupBy(this.dataSet, item => item.id);
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
            item.right,
            item.rightNote,
            item.area,
            item.areaNote,
            item.termIsPermanent,
            this.formatDate(datePipe, item.termStartDate),
            this.formatDate(datePipe, item.termEndDate),
            item.termNote,
            item.note);
        })
      );
      return program;
    });

    this.service.addCopyrights(this.service.toAddCopyrightsData(contract, orders, programs))
      .subscribe(result => {
        this.message.success(this.translate.instant('global.save-successfully'));
      });
  }

}
