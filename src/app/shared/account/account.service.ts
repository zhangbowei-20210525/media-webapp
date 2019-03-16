import { ResponseDto } from '@shared';
import { Injectable, ComponentRef, Inject } from '@angular/core';
import { LoginComponent } from './login.component';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { observable, Observable, of, Observer, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BindPhoneComponent } from './bind-phone.component';
import { BindWechatComponent } from './bind-wechat.component';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  static KEY = '_accountService';

  loginRef: {
    modalRef: ComponentRef<{ close: () => void, createWxLoginQRCode: () => void }>
  };

  constructor(
    private overlay: Overlay,
    private http: HttpClient,
    @Inject(DOCUMENT) private doc: any
  ) { console.log(+new Date); }

  attach() {
    this.doc[AccountService.KEY] = this;
  }

  detach() {
    this.doc[AccountService.KEY] = undefined;
  }

  openLoginModal() {
    const config = this.getCustomerOverlayConfig();
    let overlayRef = this.overlay.create(config);
    let modalRef = overlayRef.attach(new ComponentPortal(LoginComponent));
    modalRef.instance.service = this;
    modalRef.instance.$close.subscribe(() => {
      if (modalRef) {
        overlayRef.dispose();
        overlayRef = null;
        modalRef = null;
        this.loginRef = null;
        this.detach();
      }
    });
    this.loginRef = { modalRef: modalRef };
    this.attach();
  }

  openBindPhoneModal() {
    const config = this.getCustomerOverlayConfig();
    let overlayRef = this.overlay.create(config);
    let modalRef = overlayRef.attach(new ComponentPortal(BindPhoneComponent));
    modalRef.instance.service = this;
    modalRef.instance.$close.subscribe(() => {
      if (modalRef) {
        overlayRef.dispose();
        overlayRef = null;
        modalRef = null;
      }
    });
  }

  openBindWechatModal() {
    const config = this.getCustomerOverlayConfig();
    let overlayRef = this.overlay.create(config);
    let modalRef = overlayRef.attach(new ComponentPortal(BindWechatComponent));
    modalRef.instance.service = this;
    modalRef.instance.$close.subscribe(() => {
      if (modalRef) {
        overlayRef.dispose();
        overlayRef = null;
        modalRef = null;
      }
    });
  }

  getOriginOverlayConfig() {
    const config = new OverlayConfig();
    config.positionStrategy = this.overlay.position()
      .global() // 全局显示
      .centerHorizontally() // 水平居中
      .centerVertically(); // 垂直居中
    config.hasBackdrop = true; // 设置overlay后面有一层背景, 当然你也可以设置backdropClass 来设置这层背景的class
    return config;
  }

  getCustomerOverlayConfig() {
    const config = new OverlayConfig();
    config.positionStrategy = this.overlay.position()
      .global() // 全局显示
      .centerHorizontally() // 水平居中
      .centerVertically(); // 垂直居中
    config.hasBackdrop = true;
    config.backdropClass = 'cdk-overlay-dark-backdrop-customer';
    // global.less 中覆盖 cdk-overlay-dark-backdrop 样式，并新增 cdk-overlay-dark-backdrop-customer
    return config;
  }

  getCaptcha(phone: string) {
    return this.http.get<any>('/api/v1/sms', { params: { phone, _allow_anonymous: '' } });
    // return of(654321);
  }

  phoneValidate(phone: string, code: string) {
    return this.http.post<any>('/api/v1/login/phone', { phone, code }, { params: { _allow_anonymous: '' } });
    // return of('ok');
  }

  wechatValidate(code: string) {
    return this.http.post<any>('/api/v1/login/wechat', { code }, { params: { _allow_anonymous: '' } });
    // return of('ok');
  }

  bindPhoneValidate(phone: string, code: string) {
    return this.http.post<any>('/api/v1/users/login_info/phone', { phone, code });
  }

  bindWechatValidate(code: string) {
    return this.http.post<any>('/api/v1/users/login_info/wechat', { code });
  }

  emailRegister(email: string, password: string, nickname: string) {
    return this.http.post('/api/v1/register/email', { email, password, nickname }, { params: { _allow_anonymous: '' } });
  }

  emailValidate(email: string, password: string) {
    return this.http.post<any>('/api/v1/login/email', { email, password }, { params: { _allow_anonymous: '' } });
  }

  emailActivate(token: string) {
    return this.http.post('/api/v1/activate/email', { email_token: token }, { params: { _allow_anonymous: '' } });
  }
}
