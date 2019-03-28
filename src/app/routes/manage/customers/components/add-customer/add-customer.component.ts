import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from '../../customers.service';
import { Observable } from 'rxjs';
import { MessageService } from '@shared';
import { SFComponent } from '@delon/form';

declare type CustomType = 'enterprise' | 'personal';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.less']
})
export class AddCustomerComponent implements OnInit {

  baseForm: FormGroup;
  enterpriseForm: FormGroup;
  personalFomr: FormGroup;

  @ViewChild('sf') sf: SFComponent;

  customTagOptions: [];
  schema = {
    properties: {
      liaison: {
        type: 'array',
        title: '联系人',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            main: {
              type: 'boolean',
              title: '主要联系人',
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18
              }
            },
            name: {
              type: 'string',
              title: '联系人名',
              required: true,
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人名'
              }
            },
            phone: {
              type: 'string',
              title: '手机号码',
              required: true,
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人手机号码'
              }
            },
            wx: {
              type: 'string',
              title: '微信号',
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人微信号'
              }
            },
            email: {
              type: 'string',
              title: '邮箱',
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人邮箱地址'
              }
            },
            department: {
              type: 'string',
              title: '所属部门',
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人所属部门'
              }
            },
            position: {
              type: 'string',
              title: '所在职位',
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人所在职位'
              }
            }
          },
          ui: { offsetControl: 0 },
          required: ['name', 'phone']
        },
        ui: {
          spanLabel: 3,
          offsetControl: 1,
          spanControl: 20,
          grid: { arraySpan: 24 },
          removeTitle: '移除',
        }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private service: CustomersService,
    private messsage: MessageService
  ) { }

  ngOnInit() {
    this.baseForm = this.fb.group({
      customType: ['enterprise', [Validators.required]]
    });
    this.enterpriseForm = this.fb.group({
      name: [null, [Validators.required]],
      abbreviation: [null],
      telephone: [null, [Validators.required]],
      tags: [null],

      liaison_name: [null],
      phone: [null],
      wx_id: [null],
      email: [null],
      department: [null],
      position: [null],
      remark: [null],
    });
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

  validation() {
    return this.validationForm(this.enterpriseForm);
  }

  submit(): Observable<any> {
    this.messsage.success(JSON.stringify(this.sf.value));
    // const form = this.enterpriseForm;
    // const data = {
    //   custom_type: form.value['custom_type'] || null,
    //   name: form.value['name'] || null,
    //   abbreviation: form.value['abbreviation'] || null,
    //   telephone: form.value['telephone'] || null,
    //   liaison_name: form.value['liaison_name'] || null,
    //   phone: form.value['phone'] || null,
    //   wx_id: form.value['wx_id'] || null,
    //   email: form.value['email'] || null,
    //   department: form.value['department'] || null,
    //   position: form.value['position'] || null,
    //   remark: form.value['remark'] || null,
    //   tag: form.value['tag'] || null,
    //   liaison_remark: null
    // };
    // return this.service.addCustomer(data);
  }

  schemaSubmit(value: any) {
    this.messsage.success(value);
  }

}
