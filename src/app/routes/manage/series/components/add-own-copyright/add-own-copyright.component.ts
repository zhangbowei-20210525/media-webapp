import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ReactiveBase } from '../../reactive-form/reactive-base';
import { NzMessageService } from 'ng-zorro-antd';
import { PaymentControlService } from '../../reactive-form/payment-control.service';
import { CopyrightsService } from '../../reactive-form/copyrights.service';
import { DatePipe } from '@angular/common';
import { ContractCopyrightDto } from '../../dtos/contract-copyright.dto';

@Component({
  selector: 'app-add-own-copyright',
  templateUrl: './add-own-copyright.component.html',
  styleUrls: ['./add-own-copyright.component.less']
})
export class AddOwnCopyrightComponent implements OnInit {

  typeForm: FormGroup;
  contractForm: FormGroup;
  rightForm: FormGroup;
  paymentForm: FormGroup;

  payments: ReactiveBase<any>[][];

  customerOptions: { id: number, name: string, contact_name: string }[] = [];
  copyrightAreaOptions: any[];

  lastProjectType: string;
  dataset = [];
  copyrightsType = [];


  nodes = [ {
    title   : 'Node1',
    value   : '0-0',
    key     : '0-0',
    children: [ {
      title : 'Child Node1',
      value : '0-0-0',
      key   : '0-0-0',
      isLeaf: true
    } ]
  }, {
    title   : 'Node2',
    value   : '0-1',
    key     : '0-1',
    children: [ {
      title : 'Child Node3',
      value : '0-1-0',
      key   : '0-1-0',
      isLeaf: true
    }, {
      title : 'Child Node4',
      value : '0-1-1',
      key   : '0-1-1',
      isLeaf: true
    }, {
      title : 'Child Node5',
      value : '0-1-2',
      key   : '0-1-2',
      isLeaf: true
    } ]
  } ];

  get copyrights() {
    return this.rightForm.get('copyrights') as FormArray;
  }

  get hasContract() {
    return this.typeForm.value['hasContract'] === 'yes';
  }

  constructor(
    private fb: FormBuilder,
    private copyrightService: CopyrightsService,
    private messageService: NzMessageService,
    private pcs: PaymentControlService
  ) { }

  ngOnInit() {
    this.typeForm = this.fb.group({
      investmentType: ['homemade', [Validators.required]],
      hasContract: ['no']
    });

    this.contractForm = this.fb.group({
      customer: [null, [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.pattern('[0-9]*(/.[0-9]{1,2})?')]],
      paymentMethod: [null, [Validators.required]],
      payments: this.fb.array([]),
      contractName: [null, [Validators.required]],
      contractNumber: [null, [Validators.required]]
    });
    // this.copyrightService.getCopyrightsType().subscribe(res => {
    //     this.copyrightsType = res.data;
    //   });

    this.rightForm = this.fb.group({
      copyrights: this.fb.array([null]),
      copyrightNote: [null],
      copyrightArea: [null, [Validators.required]],
      copyrightAreaNote: [null],
      copyrightValidTerm: [null],
      copyrightValidTermIsPermanent: [false],
      copyrightValidTermNote: [null],
      note: [null]
    });

    // this.copyrightService.getCustomerWithLikeKeyword('')
    // .pipe(dtoMap(e => e.data), dtoCatchError())
    // .subscribe(res => {
    //   this.customerOptions = res;
    // });

    // this.copyrightService.getCopyrightAreaOptions()
    //   .subscribe(res => {
    //     this.copyrightAreaOptions = res.data;
    //   });
  }

  createCopyrightCheckbox(defaultStatus: boolean, userdata: any) {
    const control = this.fb.control(defaultStatus);
    control['__userdata'] = userdata;
    return control;
  }

  createProjectCheckbox(defaultStatus: boolean, project: { id?: number, title: string, type?: string, episodesNum?: number }) {
    const control = this.fb.control(defaultStatus);
    control['__userdata'] = project;
    return control;
  }

  checkForm(form: FormGroup): boolean {
    const controls = form.controls;
    for (const i in controls) {
      if (controls.hasOwnProperty(i)) {
        controls[i].markAsDirty();
        controls[i].updateValueAndValidity();
      }
    }
    return form.valid;
  }

  checkContractForm(): boolean {
    if (!this.hasContract) {
      return true;
    }
    return this.checkForm(this.contractForm) && this.checkForm(this.paymentForm);
  }

  onPaymentMethodChange(value: string) {
    const count = parseInt(value, 10);
    this.payments = this.copyrightService.getCopyrightPaymentReactives(count);
    const fg = {};
    this.payments.map(p => this.pcs.toFormGroup(p)).forEach(p => {
      const c = p.controls;
      for (const key in c) {
        if (c.hasOwnProperty(key)) {
          fg[key] = c[key];
        }
      }
    });
    this.paymentForm = this.fb.group(fg);
  }

  addToPendingPurchase() {
    const form = this.rightForm;
    if (this.checkForm(form)) {
          this.copyrights.controls
            .filter(c => c.value === true)
            .forEach(c => {
              const rightData = c['__userdata'];
              const formArea = form.value['copyrightArea'];
              const lastFormArea = formArea[formArea.length - 1];
              const option = this.getAreaOption(this.copyrightAreaOptions, lastFormArea);
              const copyright = {
                contractCustomer: '',
                right: rightData.value,
                rightText: rightData.displayText,
                area: lastFormArea,
                areaText: option.label,
                dateRangeStart: form.value['copyrightValidTerm'] ? form.value['copyrightValidTerm'][0] : '',
                dateRangeEnd: form.value['copyrightValidTerm'] ? form.value['copyrightValidTerm'][1] : '',
                dateRangeIsPermanent: form.value['copyrightValidTermIsPermanent'],
                paymentMethod: '',
                note: form.value['note'],
                rightNote: form.value['copyrightNote'],
                areaNote: form.value['copyrightAreaNote'],
                dateRangeNote: form.value['copyrightValidTermNote']
              };
              this.dataset = [...this.dataset, copyright];
            });

    }
  }

  getAreaOption(options: any[], value: any) {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const element = options[key];
        if (element.value === value) {
          return element;
        } else if (element.children && element.children.length > 0) {
          const rtn = this.getAreaOption(element.children, value);
          if (rtn) {
            return rtn;
          }
        }
      }
    }
    return null;
  }

  deleteDataset(data: any) {
    this.dataset = this.dataset.filter(d => d !== data);
  }

  submitContractForm() {
    const form = this.contractForm;
    const customer = form.value['customer'];
    const option = this.customerOptions.find(e => e.name === customer);
    const datePipe = new DatePipe('zh-CN');
    let contract: ContractCopyrightDto;
    if (!this.hasContract) {
      contract = { has_contract: false, series_list: [] } as ContractCopyrightDto;
    } else {
      contract = {
        has_contract: true,
        contract_name: form.value['contractName'] || null,
        contract_number: form.value['contractNumber'] || null,
        customer_id: option ? option.id : null,
        total_amount: form.value['totalAmount'] || null,
        // order_list: [{ pay_date: '2018-12-13', pay_amount: form.value['totalAmount'] }],
        order_list: [],
        series_list: []
      };
      this.payments.forEach(p => {
        const paymentOrder = {
          pay_date: datePipe.transform(this.paymentForm.value[p[0].key], 'yyyy-MM-dd'),
          pay_amount: this.paymentForm.value[p[1].key],
          pay_remark: this.paymentForm.value[p[2].key]
        };
        contract.order_list.push(paymentOrder);
      });
    }
    const projectsGroup = this.groupBy(this.dataset, e => e.projectTitle);
    projectsGroup.forEach(projects => {
      const first = projects[0];
      const series = {
        series_id: first.projectID || null,
        series_name: first.projectTitle || null,
        series_type: first.projectType || null,
        episodes_num: first.projectEpisodes || null,
        investment_type: this.typeForm.value['investmentType'],
        right_list: []
      };
      projects.forEach(p => {
        const start = datePipe.transform(p.dateRangeStart, 'yyyy-MM-dd');
        const end = datePipe.transform(p.dateRangeEnd, 'yyyy-MM-dd');
        const right = {
          right_type: p.right || null,
          right_remark: p.rightNote || null,
          area_number: p.area || null,
          area_remark: p.areaNote || null,
          is_permanent: p.dateRangeIsPermanent || null,
          start_date: start || null,
          end_date: end || null,
          period_remark: p.dateRangeNote || null,
          remark: p.note || null
        };
        series.right_list.push(right);
      });
      contract.series_list.push(series);
    });
    return this.copyrightService.addCopyrights(contract);
  }

  groupBy(array: any[], f: (object: any) => any) {
    const groups = {};
    array.forEach(function (o) {
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }

}
