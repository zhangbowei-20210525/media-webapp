import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountService } from '@shared';

declare const WxLogin: any;

@Component({
  selector: 'app-bind-wechat',
  templateUrl: './bind-wechat.component.html',
  styleUrls: ['./login.component.less']
})
export class BindWechatComponent implements OnInit {

  $close: Subject<never>;
  service: AccountService;

  constructor() {
    this.$close = new Subject();
  }

  ngOnInit(): void {
    this.createWxLoginQRCode();
  }

  close() {
    this.$close.next();
  }

  createWxLoginQRCode() {
    const obj = new WxLogin({
      self_redirect: true,
      id: 'wx_login_container',
      appid: 'wxfbe18062a4d62486',
      scope: 'snsapi_login',
      redirect_uri: 'http://vip.bctop.net/oauth2/wx',
      state: 'STATE_BINDING',
      style: '',
      // href: 'http://localhost/assets/css/wx_login.css'
    });
  }
}
