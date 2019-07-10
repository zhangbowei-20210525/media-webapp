import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotifyService } from '../notify/notify.service';

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
  isDisparShow = false;
  authInfo: any;
  typeCompany: any;
  companyId: any;
  acceptCompany: any;
  typeId: any;
  companyList = [];
  isChoseShow = false;

  constructor(
    private service: NotifyService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      companyFullName: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
    });

    if (this.type === 'SOU005') {
      this.service.getAuthorizationInfo(this.id).subscribe(res => {
        this.authInfo = res;
        this.typeCompany = res.auth_custom_name;
        this.companyId = res.auth_company_id;
        this.service.getCompanyList().subscribe(cl => {
          this.acceptCompany = res.company_full_name;
          this.companyList = cl;
        });
        this.validateForm.get('companyFullName').setValue(res.auth_custom_name);
        this.validateForm.get('phone').setValue(res.auth_phone);
        this.validateForm.get('phone').disable();
      });
    }
  }

  validation() {
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

  onChoseCompany(data) {
    this.companyId = data;
    if (!!data) {
      this.isChoseShow = true;
    } else {
      this.isChoseShow = false;
    }
  }

  submit() {
    const status = true;
    if (this.companyId === undefined) {
      console.log(this.companyId);
      this.companyId = '';
    }
   return this.service.pubAuth(status, this.companyId, this.typeCompany, this.id);
  }

}
