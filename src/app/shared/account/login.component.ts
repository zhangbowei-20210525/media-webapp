import { DataSet } from '@antv/data-set';
import { SeriesService } from 'app/routes/manage/series/series.service';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { delay, finalize, map } from 'rxjs/operators';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { AccountService, PaginationDto } from '@shared';
import { SettingsService } from '@core';
import { MessageService } from '../message/message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

declare const WxLogin: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {

  $close: Subject<never>;
  service: AccountService;
  form: FormGroup;
  emailRegisterForm: FormGroup;
  emailLogInForm: FormGroup;
  mode: 'phone' | 'wx' | 'email' | 'emailRegister' | 'emailLogIn' |string = 'phone';
  isLoadingCaptcha = false;
  isCaptchaSended = false;
  captchaSendCountDown: number;
  isLoggingIn = false;
  interval$: any;
  pagination = { page: 1, page_size: 10 } as PaginationDto;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private settings: SettingsService,
    private message: MessageService,
    private translate: TranslateService,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService
  ) {
    this.$close = new Subject();
  }

  get phone(): AbstractControl {
    return this.form.controls['phone'];
  }

  get captcha(): AbstractControl {
    return this.form.controls['captcha'];
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      phone: [null, [Validators.required]],
      captcha: [null, [Validators.required]],
      remember: [true]
    });

    this.emailRegisterForm = this.fb.group({
      nickname: [null, [Validators.required]],
      emailAddress: [null, [Validators.required]],
      emailPassword: [null, [Validators.required]],
    });

    this.emailLogInForm = this.fb.group({
      emailAddress: [null, [Validators.required]],
      emailPassword: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    if (this.interval$) { clearInterval(this.interval$); }
  }

  close() {
    this.$close.next();
  }

  getCaptcha(e: MouseEvent) {
    this.phone.markAsDirty();
    this.phone.updateValueAndValidity();
    if (this.phone.valid) {
      this.isLoadingCaptcha = true;
      this.service.getCaptcha(this.phone.value)
        .pipe(finalize(() => this.isLoadingCaptcha = false))
        .subscribe(() => {
          // this.translate.instant('app.login.get-captcha-success');
          this.message.success(this.translate.instant('app.login.get-captcha-success'));
          this.freezeGetCaptchaButton(60);
        }, error => {

        });
    }
    e.preventDefault();
  }

  freezeGetCaptchaButton(max: number) {
    this.isCaptchaSended = true;
    this.captchaSendCountDown = max;
    this.interval$ = setInterval(() => {
      this.captchaSendCountDown = this.captchaSendCountDown - 1;
      if (this.captchaSendCountDown <= 0) {
        this.isCaptchaSended = false;
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  switchLoginMode(mode: string) {
    this.mode = mode;
    if (mode === 'wx') {
      setTimeout(() => {
        this.createWxLoginQRCode();
      }, 0);
    }
  }

  createWxLoginQRCode() {
    const obj = new WxLogin({
      self_redirect: true,
      id: 'wx_login_container',
      appid: 'wxfbe18062a4d62486',
      scope: 'snsapi_login',
      redirect_uri: 'https://www.bctop.net/oauth2/wx',
      state: 'STATE_LOGIN',
      style: '',
      // href: 'http://localhost/assets/css/wx_login.css'
    });
  }

  validation(): boolean {
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    return this.form.valid;
  }

  emailRegisterValidation(): boolean {
    for (const i in this.emailRegisterForm.controls) {
      if (this.emailRegisterForm.controls.hasOwnProperty(i)) {
        this.emailRegisterForm.controls[i].markAsDirty();
        this.emailRegisterForm.controls[i].updateValueAndValidity();
      }
    }
    return this.emailRegisterForm.valid;
  }

  emailLogInValidation(): boolean {
    for (const i in this.emailLogInForm.controls) {
      if (this.emailLogInForm.controls.hasOwnProperty(i)) {
        this.emailLogInForm.controls[i].markAsDirty();
        this.emailLogInForm.controls[i].updateValueAndValidity();
      }
    }
    return this.emailLogInForm.valid;
  }

  submit() {
    if (this.validation()) {
      this.isLoggingIn = true;
      this.service.phoneValidate(this.phone.value, this.captcha.value)
        .pipe(finalize(() => this.isLoggingIn = false))
        .subscribe(result => {
          this.settings.user = result.auth;
          this.token.set({
            token: result.token,
            time: +new Date
          });
          this.close();
          this.router.navigate([`/manage/series`]);
        }, error => {

        });
    }
  }

  emailRegisterSubmit() {
    if (this.emailRegisterValidation()) {
      const data = {
        nickname: this.emailRegisterForm.value['nickname'] || null,
        email: this.emailRegisterForm.value['emailAddress'] || null,
        password: this.emailRegisterForm.value['emailPassword'] || null,
      };
    this.service.emailRegister(data).subscribe();
    }
  }
}
