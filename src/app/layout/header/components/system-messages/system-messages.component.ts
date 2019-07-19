import { Component, OnInit, Input } from '@angular/core';
import { NotifyService } from '../notify/notify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-system-messages',
  templateUrl: './system-messages.component.html',
  styleUrls: ['./system-messages.component.less']
})
export class SystemMessagesComponent implements OnInit {

  @Input() created_at: string;
  @Input() content: string;
  @Input() id: number;
  @Input() type: string;
  publicity: any;
  validateForm: FormGroup;
  created_employee: any;
  company: any;
  companyList = [];
  acceptCompany: string;
  shareId: any;
  isDisparShow = false;


  constructor(
    private service: NotifyService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      // companyFullName: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
      companyName: [null, [Validators.required]],
    });
    if (this.type === 'PUB001') {
      this.service.getSharingInfo(this.id).subscribe(res => {
        console.log(res);
        this.id = res.id;
        this.shareId = res.created_employee.company_id;
        console.log(this.shareId);
        this.publicity = res.publicity;
        this.created_employee = res.created_employee;
        this.company = res.liaison.custom.name;
        this.validateForm.get('companyName').setValue(res.liaison.custom.name);
        this.validateForm.get('phone').setValue(res.liaison.phone);
        this.validateForm.get('phone').disable();
        this.service.getCompanyList().subscribe(cl => {
          console.log(cl);
          this.companyList = cl;
          this.acceptCompany = res.company_full_name;
        });
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
    console.log(form.valid);
    return form.valid;
  }

  onDisperChange(data) {
    console.log(this.shareId);
    this.shareId = data;
    if (!!data) {
      this.isDisparShow = true;
    } else {
      this.isDisparShow = false;
    }
  }

  submit() {
    const status = true;
    if (this.shareId === undefined) {
      this.shareId = '';
    }
    return this.service.getAccept(status, this.shareId, this.company, this.id);
  }

}
