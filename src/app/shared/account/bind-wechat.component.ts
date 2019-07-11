import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountService } from '@shared';
import { LazyService } from '@core/lazy';

declare const WxLogin: any;

@Component({
  selector: 'app-bind-wechat',
  templateUrl: './bind-wechat.component.html',
  styleUrls: ['./login.component.less']
})
export class BindWechatComponent implements OnInit {

  $close: Subject<never>;
  service: AccountService;

  constructor(
    private lazy: LazyService
  ) {
    this.$close = new Subject();
  }

  ngOnInit(): void {
    this.createWxLoginQRCode();
  }

  close() {
    this.$close.next();
  }

  createWxLoginQRCode() {
    this.lazy.load('https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js').then(result => {
      const wxLoginScript = result[0];
      if (wxLoginScript.loaded) {
        WxLogin({
          self_redirect: true,
          id: 'wx_login_container',
          appid: 'wxfbe18062a4d62486',
          scope: 'snsapi_login',
          redirect_uri: 'https://www.bctop.net/oauth2/callback/wechat',
          state: 'STATE_BINDING',
          style: '',
          // href: 'http://localhost/assets/css/wx_login.css' // 覆盖微信默认样式
        });
      }
    });
  }
}
