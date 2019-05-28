import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PubAuthorizationReceiveService } from './pub-authorization-receive.service';
import { MessageService, TreeService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, AuthService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'app-pub-authorization-receive',
  templateUrl: './pub-authorization-receive.component.html',
  styleUrls: ['./pub-authorization-receive.component.less']
})
export class PubAuthorizationReceiveComponent implements OnInit {

  validateForm: FormGroup;
  isShow = false;
  authInfo: any;
  id: number;

  constructor(
    public settings: SettingsService,
    private router: Router,
    private fb: FormBuilder,
    private service: PubAuthorizationReceiveService,
    private message: MessageService,
    private translate: TranslateService,
    private ts: TreeService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      companyFullName: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
      companyName: [null, [Validators.required]],
    });
    this.service.getAuthorizationInfo().subscribe(res => {
      this.authInfo = res[0];
      this.id = res[0].id;
      this.validateForm.get('companyFullName').setValue(res[0].auth_custom_name);
      this.validateForm.get('companyName').setValue(res[0].auth_custom_abbreviation);
      this.validateForm.get('phone').setValue(res[0].auth_phone);
      this.validateForm.get('phone').disable();
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
    const form = this.validateForm;
      const data = {
        status: true,
        company_full_name: form.value['companyFullName'] || null,
        company_name: form.value['companyName'] || null,
      };
      this.service.pubAuth(this.id, data).subscribe(res => {
        this.service.switchCompany(res.employee_id).subscribe(result => {
          this.auth.login(
            {
              token: result.token,
              time: +new Date
            },
            result.auth,
            this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status));
          this.message.success(this.translate.instant('global.accept-authorization-successfully'));
          this.router.navigate(['/manage/transmit/type']);
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

  getReceiveInfo() {
    this.isShow = true;
    // this.router.navigate([`/manage/series`]);
  }

}
