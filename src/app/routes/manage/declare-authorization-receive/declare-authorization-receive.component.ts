import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeclareAuthorizationReceiveService } from './declare-authorization-receive.service';
import { MessageService, TreeService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'app-declare-authorization-receive',
  templateUrl: './declare-authorization-receive.component.html',
  styleUrls: ['./declare-authorization-receive.component.less']
})
export class DeclareAuthorizationReceiveComponent implements OnInit {

  validateForm: FormGroup;
  publicity: any;
  id: number;
  related_id: any;
  liaison: any;
  created_employee: any;
  constructor(
    public settings: SettingsService,
    private router: Router,
    private fb: FormBuilder,
    private service: DeclareAuthorizationReceiveService,
    private message: MessageService,
    private translate: TranslateService,
    private ts: TreeService,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,
  ) { }

  ngOnInit() {

    this.validateForm = this.fb.group({
      companyFullName: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
      companyName: [null, [Validators.required]],
    });
    this.related_id = this.token.get().callback.related_id;
    // console.log(this.token.get());
    this.service.getAuthorizationInfo(this.related_id).subscribe(res => {
      this.publicity = res.publicity;
      this.liaison = res.liaison;
      this.created_employee = res.created_employee;
      // this.authInfo = res[0];
      // this.id = res[0].id;
      this.validateForm.get('companyFullName').setValue(res.liaison.custom.name);
      this.validateForm.get('phone').setValue(res.liaison.phone);
      this.validateForm.get('phone').disable();

      // this.validateForm.get('companyName').setValue(res[0].auth_custom_abbreviation);
      // this.validateForm.get('phone').setValue(res[0].auth_phone);
      // this.validateForm.get('phone').disable();
      // console.log(res);
    });
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

  submit() {
    // this.router.navigate([`/manage/transmit`]);
    const form = this.validateForm;
      const data = {
        status: true,
        company_full_name: form.value['companyFullName'] || null,
        company_name: form.value['companyName'] || null,
      };
      this.service.pubAuth(this.id, data).subscribe(res => {
        this.service.switchCompany(res.employee_id).subscribe(result => {
          this.settings.user = result.auth;
          this.settings.permissions = this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status);
          this.token.set({
            token: result.token,
            time: +new Date
          });
          this.message.success(this.translate.instant('global.accept-authorization-successfully'));
          this.router.navigate([`/manage/image`]);
        });
      });
  }

  refused() {
    const form = this.validateForm;
    const data = {
      status: false,
      company_full_name: null,
      company_name: null,
    };
    this.service.pubAuth(this.id, data).subscribe(res => {
      this.message.warning(this.translate.instant('global.refused-authorization-information'));
      this.router.navigate([`/manage/series`]);
    });
  }

}

