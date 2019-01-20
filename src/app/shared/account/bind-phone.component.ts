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

@Component({
  selector: 'app-bind-phone',
  templateUrl: './bind-phone.component.html',
  styleUrls: ['./login.component.less']
})
export class BindPhoneComponent implements OnInit, OnDestroy {

  $close: Subject<never>;
  service: AccountService;
  form: FormGroup;
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
          this.token.set({
            token: result.token,
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
