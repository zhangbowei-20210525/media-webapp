import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from '../../customers.service';
import { Observable, throwError } from 'rxjs';
import { MessageService } from '@shared';
import { SFComponent, FormProperty, PropertyGroup } from '@delon/form';

declare type CustomType = 'enterprise' | 'personal';

// tslint:disable-next-line:max-line-length
const EMAIL_EXGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.less']
})
export class AddCustomerComponent implements OnInit {

  baseForm: FormGroup;
  enterpriseForm: FormGroup;
  personalFomr: FormGroup;
  // liaisonForm: FormGroup;

  @ViewChild('sf') sf: SFComponent;

  customTagOptions: string[];
  schema = {
    properties: {
      liaisons: {
        type: 'array',
        title: '联系人',
        minItems: 1,
        maxItems: 3,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              title: '联系人名',
              required: true,
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人名',
                errors: {
                  required: '请输入联系人名'
                }
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
                placeholder: '请输入联系人手机号码',
                validator: (value: any, property: FormProperty, form: PropertyGroup) => {
                  return /^[1][3,4,5,7,8][0-9]{9}$/.test(value) ? [] : [{ keyword: 'phone', message: '请输入正确的手机号码'}];
                },
                errors: {
                  required: '请输入联系人手机号码'
                }
              }
            },
            wx_id: {
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
              // nzRequired: true,
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人邮箱地址',
                validator: (value: any, property: FormProperty, form: PropertyGroup) => {
                  return EMAIL_EXGEXP.test(value) ? [] : [{ keyword: 'email', message: '请输入正确的邮箱地址'}];
                },
                // errors: {
                //   required: '情输入联系人邮箱地址',
                // }
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
            },
            remark: {
              type: 'string',
              title: '备注',
              ui: {
                spanLabel: 5,
                offsetControl: 0,
                spanControl: 18,
                placeholder: '请输入联系人备注'
              }
            }
          },
          ui: { offsetControl: 0 },
          required: ['name', 'phone']
          // nzRequired: ['name','phone']
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
      telephone: [null, [Validators.pattern(/^0\d{2,3}-?\d{7,8}$/)]], // [Validators.required, Validators.pattern(/^0\d{2,3}-?\d{7,8}$/)]
      remark: [null],
      tags: [[]]
    });
    // this.liaisonForm = this.fb.group({
    //   name: [null, [Validators.required]],
    //   phone: [null, [Validators.required]],
    //   wx_id: [null],
    //   email: [null],
    //   department: [null],
    //   position: [null],
    //   remark: [null]
    // });

    this.service.getTags().subscribe(tags => {
      this.customTagOptions = tags;
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
    // return this.validationForm(this.enterpriseForm) && this.validationForm(this.liaisonForm);
    return this.validationForm(this.enterpriseForm);
    // const enterpriseValid = this.validationForm(this.enterpriseForm);
    // // console.log(enterpriseValid)
    // this.sf.validator();
    // // this.sf.refreshSchema();
    // console.log(enterpriseValid);
    // console.log(this.sf)

    // return enterpriseValid && this.sf.valid;
  }

  submit(): Observable<any> {
    console.log('ssss')
    if (this.sf.value.liaisons.length > 0 && !this.sf.valid) {
      return throwError({});
    }
    const custom = this.enterpriseForm.value;
    custom.custom_type = this.baseForm.value['customType'] === 'enterprise' ? 0 : 1;
    // const liaisons = [this.liaisonForm.value, ...this.sf.value.liaisons];
    const liaisons = [...this.sf.value.liaisons];
    console.log(custom);
    console.log(liaisons);
    return this.service.addCustomer({ custom, liaisons });
    
  }

  schemaSubmit(value: any) {
    this.messsage.success(JSON.stringify(value));
  }
}
