import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyService } from '../notify/notify.service';
import { MessageService } from '@shared';

@Component({
  selector: 'app-delivery-copyright-messages',
  templateUrl: './delivery-copyright-messages.component.html',
  styleUrls: ['./delivery-copyright-messages.component.less']
})
export class DeliveryCopyrightMessagesComponent implements OnInit {

  @Input() created_at: string;
  @Input() content: string;
  @Input() id: number;
  @Input() type: string;
  @Input() is_process: boolean;

  validateForm: FormGroup;
  addForm: FormGroup;
  isDisparShow = false;
  authInfo: any;
  typeCompany: any;
  acceptCompany: any;
  typeId: any;
  companyList = [];
  isChoseShow = false;
  tabIndex = 0;
  isShow = true;
  auth_cid: number;
  year: number;
  mouth: number;
  day: number;

  constructor(
    private service: NotifyService,
    private fb: FormBuilder,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      companyFullName: [null, [Validators.required]],
      // phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
    });
    this.addForm = this.fb.group({
      addCompanyFullName: [null, [Validators.required]],
      // addPhone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
    });
      this.service.getDeliveryCopyrightInfo(this.id).subscribe(res => {
        // this.auth_cid = res.auth_company_id;
        // if (this.auth_cid > 0) {
        //   this.isShow = false;
        // }
        this.authInfo = res;
        if (this.authInfo.receipt_at !== null) {
          this.year = new Date(this.authInfo.receipt_at).getFullYear();
          this.mouth = new Date(this.authInfo.receipt_at).getMonth() + 1;
          this.day = new Date(this.authInfo.receipt_at).getUTCDate();
        }
        // this.typeCompany = res.auth_custom_name;
        // // this.companyId = res.auth_company_id;
        // this.service.getCompanyList().subscribe(cl => {
        //   this.acceptCompany = res.company_full_name;
        //   this.companyList = cl;
        // });
        // this.validateForm.get('companyFullName').setValue(res.auth_custom_name);
        // this.validateForm.get('phone').setValue(res.auth_phone);
        // this.validateForm.get('phone').disable();
      });
  }

  show() {
    return this.isShow;
  }

  validation1() {
    const form = this.validateForm;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  validation2() {
    const form = this.addForm;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  onChoseCompany(data) {
    this.auth_cid = data;
    if (!!data) {
      this.isChoseShow = true;
    } else {
      this.isChoseShow = false;
    }
  }

  tab0() {
    this.tabIndex = 0;
  }

  tab1() {
    this.tabIndex = 1;
  }

  tab() {
    return this.tabIndex;
  }

  tabChange(event) {
    console.log(event);
  }

  cid() {
    return this.auth_cid;
  }

  submit() {

    if (this.isShow === false) {
      const status = true;
      return this.service.pubAuth(status, this.auth_cid, this.id);
    } else {
      if (this.tabIndex === 0) {
        const status = true;
        return this.service.pubAuth(status, this.auth_cid, this.id);
      }
      if (this.tabIndex === 1) {
        const status = true;
        if (this.companyList.find(f => this.addForm.value['addCompanyFullName'] === f.company_full_name)) {
          this.message.warning('该公司已存在,请重新填写');
        } else {
          return this.service.newPubAuth(status, this.addForm.value['addCompanyFullName'], this.id);
        }
      }
    }
  }

}
