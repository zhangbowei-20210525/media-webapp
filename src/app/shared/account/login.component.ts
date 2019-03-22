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
import { SettingsService, I18nService } from '@core';
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

  $close: Subject<boolean>;
  service: AccountService;
  form: FormGroup;
  emailRegisterForm: FormGroup;
  emailLogInForm: FormGroup;
  passwordVisible = false;
  password: string;
  mode: 'phone' | 'wx' | 'email' | 'emailRegister' | 'emailLogIn' | string = 'phone';
  isLoadingCaptcha = false;
  isCaptchaSended = false;
  captchaSendCountDown: number;
  isLoggingIn = false;
  interval$: any;
  languageVersion: string;
  pagination = { page: 1, page_size: 10 } as PaginationDto;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private settings: SettingsService,
    private message: MessageService,
    private translate: TranslateService,
    private i18n: I18nService,
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
    // zh-CN en-US
   this.languageVersion = this.i18n.currentLang;
   if (this.languageVersion === 'en-US') {
    this.mode = 'emailLogIn';
   }
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
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    if (this.interval$) { clearInterval(this.interval$); }
  }

  close(state: boolean) {
    this.$close.next(state);
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

  validation(form: FormGroup): boolean {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        form.controls[i].markAsDirty();
        form.controls[i].updateValueAndValidity();
      }
    }
    return form.valid;
  }

  submit() {
    if (this.validation(this.form)) {
      this.isLoggingIn = true;
      this.service.phoneValidate(this.phone.value, this.captcha.value)
        .pipe(finalize(() => this.isLoggingIn = false))
        .subscribe(result => {
          this.settings.user = result.auth;
          this.token.set({
            token: result.token,
            time: +new Date
          });
          this.close(true);
          // this.router.navigate([`/manage/series`]);
        }, error => {

        });
    }
  }

  emailRegisterSubmit() {
    if (this.validation(this.emailRegisterForm)) {
    // tslint:disable-next-line:max-line-length
    this.service.emailRegister(this.emailRegisterForm.value['emailAddress'], this.emailRegisterForm.value['emailPassword'], this.emailRegisterForm.value['nickname']).subscribe(result => {
      this.message.success(this.translate.instant('app.login.email-registered-successfully'));
     this.mode = 'emailLogIn';
    });
    }
  }

  emailLoginSubmit() {
    if (this.validation(this.emailLogInForm)) {
      this.service.emailValidate(this.emailLogInForm.value['email'], this.emailLogInForm.value['password']).subscribe(result => {
        this.message.success(this.translate.instant('app.login.email-login-successfully'));
        this.settings.user = result.auth.username;
        this.token.set({
          token: result.token,
          time: +new Date
        });
        this.close(true);
        // this.router.navigate([`/manage/series`]);
      }, error => {
        console.error(error);
      });
    }
  }
}
