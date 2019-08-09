import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BindingService } from '../binding.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '@core/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { StateStoreService } from '../../state-store.service';
import { TreeService } from '@shared';
import { LoginResultDto } from '@shared/dtos';

@Component({
  selector: 'app-phone-binding',
  templateUrl: './phone-binding.component.html',
  styleUrls: ['./phone-binding.component.less']
})
export class PhoneBindingComponent implements OnInit {

  form: FormGroup;
  isSendDisabled = false;
  countdown: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private service: BindingService,
    private message: NzMessageService,
    private auth: AuthService,
    private stateStore: StateStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private ts: TreeService
  ) { }

  get phone() {
    return this.form.get('phone');
  }

  get captcha() {
    return this.form.get('captcha');
  }

  ngOnInit() {
    const state = this.stateStore.getState();
    if (state.userInfo && state.token) {
      this.form = this.fb.group({
        phone: ['', Validators.required],
        captcha: ['', Validators.required]
      });
    }
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
        this.message.success('已发送验证码');
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
      this.message.warning('请输入正确的手机号码');
    }
  }

  onSubmit() {
    if (this.validation(this.form)) {
      this.isSubmitting = true;
      this.service.bindingPhone(this.stateStore.getState().token, this.phone.value, this.captcha.value).pipe(finalize(() => {
        this.isSubmitting = false;
      })).subscribe(result => {
        if (result.auth.company_full_name) {
          // 登录成功
          this.message.success('登录成功');
          this.login(result);
        } else {
          this.router.navigateByUrl('/passport/binding/company');
        }
      });
    }
  }

  login (data: LoginResultDto) {
    this.stateStore.clearState();
    this.auth.onLogin({
      userInfo: data.auth,
      token: data.token,
      permissions: this.ts.recursionNodesMapArray(data.permissions, p => p.code, p => p.status)
    });
    this.router.navigateByUrl(this.stateStore.getDirectionUrl() || '/');
  }

}
