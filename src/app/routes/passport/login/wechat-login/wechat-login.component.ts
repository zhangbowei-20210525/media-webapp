import { Component, OnInit } from '@angular/core';
import { LazyService } from '@core/lazy';
import { AuthService } from '@core/auth';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { StateStoreService } from '../../state-store.service';

declare const WxLogin: any;

@Component({
  selector: 'app-wechat-login',
  templateUrl: './wechat-login.component.html',
  styleUrls: ['./wechat-login.component.less']
})
export class WechatLoginComponent implements OnInit {

  constructor(
    private lazy: LazyService,
    private auth: AuthService,
    private stateStore: StateStoreService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      const url = this.stateStore.getDirectionUrl();
      this.stateStore.clearState();
      console.log(url);
      this.router.navigateByUrl(url || '/');
    } else {
      const state = this.stateStore.getState();
      if (state.userInfo && state.token) {
        // this.stateStore.clearState(); // 测试时不clear
        if (state.userInfo.phone && state.userInfo.company_full_name) {
          throw Error('2019-06-21 现有逻辑不会出现此异常');
        } else if (!state.userInfo.phone) {
          this.message.info('请绑定手机号');
          this.router.navigateByUrl('/passport/binding/phone');
        } else if (!state.userInfo.company_full_name) {
          this.message.info('请绑定企业信息');
          this.router.navigateByUrl('/passport/binding/company');
        }
      } else {
        this.createQRCode();
      }
    }
  }

  createQRCode() {
    this.lazy.load('https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js').then(result => {
      const wxLoginScript = result[0];
      if (wxLoginScript.loaded) {
        WxLogin({
          self_redirect: true,
          id: 'wx_login_container',
          appid: 'wxfbe18062a4d62486',
          scope: 'snsapi_login',
          redirect_uri: `https://www.bctop.net/oauth2/callback/wechat`,
          state: 'STATE_LOGIN',
          style: '',
          // href: 'http://localhost/assets/css/wx_login.css' // 覆盖微信默认样式
        });
      }
    });
  }

}
