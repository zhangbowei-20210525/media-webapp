import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { delay, finalize, map } from 'rxjs/operators';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { AccountService } from '@shared';
import { SettingsService } from '@core';
import { MessageService } from '../message/message.service';
import { TranslateService } from '@ngx-translate/core';

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
  mode: 'phone' | 'wx' | string = 'phone';
  isLoadingCaptcha = false;
  isCaptchaSended = false;
  captchaSendCountDown: number;
  isLoggingIn = false;
  interval$: any;

  constructor(
    private fb: FormBuilder,
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
  }

  ngOnDestroy(): void {
    if (this.interval$) { clearInterval(this.interval$); }
  }

  close() {
    this.$close.next();
  }

  getCaptcha(e: MouseEvent) {
    console.log(this.token.get());
    this.phone.markAsDirty();
    this.phone.updateValueAndValidity();
    if (this.phone.valid) {
      this.isLoadingCaptcha = true;
      this.service.getCaptcha(this.phone.value)
        .pipe(
          map(body => {
            if (body.code <= 0) {
              return body.message;
            }
            throw new Error(body.message);
          }),
          finalize(() => this.isLoadingCaptcha = false))
        .subscribe(message => {
          // this.translate.instant('app.login.get-captcha-success');
          this.message.success(message || this.translate.instant('app.login.get-captcha-success'));
          this.freezeGetCaptchaButton(60);
        }, error => {
          if (error.message) {
            this.message.error(error.message);
          }
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
      redirect_uri: 'http://vip.bctop.net/oauth2/wx',
      state: 'STATE',
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

  submit() {
    if (this.validation()) {
      this.isLoggingIn = true;
      this.service.phoneValidate(this.phone.value, this.captcha.value)
        .pipe(
          map(body => {
            if (body.code <= 0) {
              return body.data;
            }
            throw new Error(body.message);
          }),
          finalize(() => this.isLoggingIn = false))
        .subscribe(result => {
          console.log(result);
          const token = result.token;
          delete result.token;
          this.settings.user = result;
          this.token.set({
            token: token,
            time: +new Date
          });
          this.close();
        }, error => {
          if (error.message) {
            this.message.error(error.message);
          }
        });
    }
  }
}
