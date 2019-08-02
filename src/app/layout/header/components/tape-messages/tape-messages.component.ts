import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyService } from '../notify/notify.service';
import { MessageService } from '@shared';

@Component({
  selector: 'app-tape-messages',
  templateUrl: './tape-messages.component.html',
  styleUrls: ['./tape-messages.component.less']
})
export class TapeMessagesComponent implements OnInit {

  @Input() created_at: string;
  @Input() content: string;
  @Input() id: number;
  @Input() type: string;

  validateForm: FormGroup;
  addForm: FormGroup;
  isDisparShow = false;
  authInfo: any;
  typeCompany: any;
  companyId: any;
  acceptCompany: any;
  typeId: any;
  companyList = [];
  isChoseShow = false;
  tabIndex = 0;
  isShow = true;
  showId: any;

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

    if (this.type === 'SOU005') {
      this.service.getAuthorizationInfo(this.id).subscribe(res => {
        this.showId = res.auth_company_id;
        if (this.showId > 0) {
          this.isShow = false;
        }
        this.authInfo = res;
        this.typeCompany = res.auth_custom_name;
        this.companyId = res.auth_company_id;
        this.service.getCompanyList().subscribe(cl => {
          this.acceptCompany = res.company_full_name;
          this.companyList = cl;
          console.log(this.companyList);
        });
        // this.validateForm.get('companyFullName').setValue(res.auth_custom_name);
        // this.validateForm.get('phone').setValue(res.auth_phone);
        // this.validateForm.get('phone').disable();
      });
    }
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
    this.companyId = data;
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

  submit() {

    if (this.isShow === false) {
      const status = true;
      return this.service.pubAuth(status, this.showId, this.id);
    } else {
      if (this.tabIndex === 0) {
        const status = true;
        if (this.companyId === undefined) {
          console.log(this.companyId);
          this.companyId = '';
        }
        return this.service.pubAuth(status, this.companyId, this.id);
      }
      if (this.tabIndex === 1) {
        console.log(this.addForm.value['addCompanyFullName']);
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
