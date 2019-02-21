import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AddCopyrightsService } from './add-copyrights.service';
import { ReactiveBase, FormControlService } from '@shared';

@Component({
  selector: 'app-add-copyrights',
  templateUrl: './add-copyrights.component.html',
  styleUrls: ['./add-copyrights.component.less']
})
export class AddCopyrightsComponent implements OnInit {

  private _series: any[];

  tab: number;
  areaTemplates: any[];
  rightTemplates: any[];
  typeForm: FormGroup;
  contractForm: FormGroup;
  paymentForm: FormGroup;
  rightForm: FormGroup;
  payments: ReactiveBase<any>[][];
  selectedSeries: any[] = [];

  tempData = [{ id: 1, name: 'abc' }, { id: 2, name: '123' }];

  constructor(
    private fb: FormBuilder,
    private service: AddCopyrightsService,
    private fcs: FormControlService
  ) { }

  get hasContract() {
    return this.typeForm.value['hasContract'] === 'yes';
  }

  get series() {
    return this._series;
  }

  set series(value: any[]) {
    this._series = value;
    this.selectedSeries = this.series ? this.series.filter(e => e.status) : [];
    this.projects = this.fb.array([...this.selectedSeries.map(item => this.fb.control(false))]);
    console.log('set series', this.selectedSeries); // 之后未被触发
  }

  // get selectedSeries() {
  //   return this.series ? this.series.filter(e => e.status) : [];
  // }

  get projects() {
    return this.rightForm.get('projects') as FormArray;
  }

  set projects(value: any) {
    this.rightForm['projects'] = value;
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
      hasContract: ['no', Validators.required]
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
      projects: this.fb.array([]),
      copyright: [null],
      copyrightNote: [null],
      copyrightArea: [null, [Validators.required]],
      copyrightAreaNote: [null],
      copyrightValidTerm: [null],
      copyrightValidTermIsPermanent: [false],
      copyrightValidTermNote: [null],
      note: [null]
    });
    console.log(this.projects.controls);
  }

  seriesTagChange(event: { checked: boolean, tag: any }) {
    event.tag.status = event.checked;
  }

  next() {
    this.tab = 1;
    console.log(this.series);
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

}
