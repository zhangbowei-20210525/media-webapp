import { Injectable, ComponentRef } from '@angular/core';
import { LoginComponent } from './login.component';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { observable, Observable, of, Observer, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BindPhoneComponent } from './bind-phone.component';
import { BindWechatComponent } from './bind-wechat.component';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private overlay: Overlay,
    private http: HttpClient
  ) { }

  open() {
    const config = this.getCustomerOverlayConfig();
    let overlayRef = this.overlay.create(config);
    let modalRef = overlayRef.attach(new ComponentPortal(LoginComponent));
    modalRef.instance.service = this;
    modalRef.instance.$close.subscribe(() => {
      if (modalRef) {
        overlayRef.dispose();
        overlayRef = null;
        modalRef = null;
      }
    });
  }

  openBindPhone() {
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

  openBindWechat() {
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
    return this.http.post<any>('/api/v1/login/phone', { phone, code });
    // return of('ok');
  }

  wechatValidate(code: string) {
    return this.http.post<{ token: string }>('/api/v1/login/wechat', { code });
    // return of('ok');
  }
}
