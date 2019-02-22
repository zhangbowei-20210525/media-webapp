import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AddCopyrightsService } from './add-copyrights.service';
import { ReactiveBase, FormControlService, TreeService } from '@shared';

@Component({
  selector: 'app-add-copyrights',
  templateUrl: './add-copyrights.component.html',
  styleUrls: ['./add-copyrights.component.less']
})
export class AddCopyrightsComponent implements OnInit {

  tab: number;
  series: any[];
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
    private ts: TreeService
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
    this.checkOptions = selected.map(item => ({ label: item.name, value: item.id, checked: true }));
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

  save() {
    if (this.typeForm.get('contract').value === 'yes' && this.validationForm(this.contractForm)) {

    }
  }

}
