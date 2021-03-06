import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';
import { AuthService } from '@core/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { StateStoreService } from '../../state-store.service';
import { TreeService } from '@shared';
import { LoginResultDto } from '@shared/dtos';
import { NotifyAlertComponent } from '@shared/components';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.less']
})
export class PhoneLoginComponent implements OnInit {

  form: FormGroup;
  isSendDisabled = false;
  countdown: number;
  isLoggingIn = false;

  employeeInvitationId: number;

  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private message: NzMessageService,
    private auth: AuthService,
    private stateStore: StateStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private ts: TreeService,
    private modal: NzModalService
  ) { }

  get phone() {
    return this.form.get('phone');
  }

  get captcha() {
    return this.form.get('captcha');
  }

  ngOnInit() {
    this.stateStore.clearState();
    this.route.paramMap.subscribe(params => {
      const url = params.get('returnUrl');
      if (url) {
        this.stateStore.setDirectionUrl(decodeURIComponent(url));
      }
      const employeeInvitationId = params.get('emp_invitation');
      if (employeeInvitationId) {
        this.employeeInvitationId = +employeeInvitationId;
      }
    });
    this.form = this.fb.group({
      phone: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }

  validation(form: FormGroup): boolean {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        form.controls[i].markAsDirty();
        form.controls[i].updateValueAndValidity();
      }
    }
    return form.valid;
  }

  onCaptchaSend() {
    this.phone.markAsDirty();
    this.phone.updateValueAndValidity();
    if (this.phone.valid) {
      this.isSendDisabled = true;
      this.service.sendCaptcha(this.phone.value).subscribe(() => {
        this.message.success('??????????????????');
        this.countdown = 60;
        const interval = setInterval(() => {
          this.countdown -= 1;
          if (this.countdown <= 0) {
            this.isSendDisabled = false;
            clearInterval(interval);
          }
        }, 1000);
      }, err => {
        this.isSendDisabled = false;
      });
    } else {
      this.message.warning('??????????????????????????????');
    }
  }

  onSubmit() {
    if (this.validation(this.form)) {
      this.isLoggingIn = true;
      this.service.loginByPhone(this.phone.value, this.captcha.value, this.employeeInvitationId).pipe(finalize(() => {
        this.isLoggingIn = false;
      })).subscribe(result => {
        this.message.success('????????????');
        this.login(result);
        // result.auth.company_full_name = null; // ??????
        // if (result.auth.company_full_name) {  // ????????????
        //   this.message.success('????????????');
        //   this.login(result);
        // } else {
        //   this.stateStore.setState({
        //     userInfo: result.auth,
        //     token: result.token,
        //   });
        //   this.router.navigateByUrl('/passport/binding/company');
        // }
      });
    }
  }

  login(data: LoginResultDto) {
    const returnUrl = this.stateStore.getDirectionUrl();
    this.stateStore.clearState();
    this.auth.onLogin({
      userInfo: data.auth,
      token: data.token,
      permissions: this.ts.recursionNodesMapArray(data.permissions, p => p.code, p => p.status)
    });
    this.router.navigate([returnUrl || '/']);
    // setTimeout(() => {
    //   this.modal.create({
    //     nzTitle: '?????????????????????',
    //     nzContent: NotifyAlertComponent
    //   });
    // }, 0);
  }
}
