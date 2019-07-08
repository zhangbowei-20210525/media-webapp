import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth';
import { CallbackService } from '../callback.service';
import { StateStoreService } from 'app/routes/passport/state-store.service';
import { TreeService } from '@shared';

@Component({
  selector: 'app-wechat',
  template: `
  <div class='wechat-panel'>
    <ng-container [ngSwitch]="validateStatus">
      <p *ngSwitchCase="'loading'">正在登录...</p>
      <p *ngSwitchCase="'successful'">登录成功，正在跳转...</p>
      <p *ngSwitchCase="'failure'">登录失败，请 <a (click)="resetLogin()">重试</a></p>
      <p *ngSwitchCase="'error'">登录参数异常</p>
    </ng-container>
  </div>
  `,
  styles: [`
  .wechat-panel {
    height: 100%;
    width: 100%;
    background: #f4f8fb;
  }
  `]
})
export class WechatComponent implements OnInit {

  validateStatus: 'loading' | 'successful' | 'failure' | 'error' = 'loading';

  constructor(
    private route: ActivatedRoute,
    private service: CallbackService,
    private auth: AuthService,
    private stateStore: StateStoreService,
    private ts: TreeService
  ) { }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('state') === 'STATE_LOGIN') { // 验证 STATE 来自登录
      this.wxloginRequest(params.get('code'));
    } else if (params.get('state') === 'STATE_BINDING') { // 验证 STATE 来自绑定
      this.wxBindRequest(params.get('code'));
    } else {
      this.validateStatus = 'error';
    }
  }

  wxloginRequest(code: string) {
    this.service.loginByWechatCode(code)
      .subscribe(result => {
        if (result.auth.phone && result.auth.company_full_name) {
          this.stateStore.clearState();
          this.auth.onLogin({
            userInfo: result.auth,
            token: result.token,
            permissions: this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status)
          });
        } else {
          this.stateStore.setState({
            userInfo: result.auth,
            token: result.token
          });
        }
        this.validateStatus = 'successful';
        this.reloadParentWindow();
      }, error => {
        this.validateStatus = 'failure';
      });
  }

  wxBindRequest(code: string) {
    this.service.bindingWechatByCode(code)
      .subscribe(result => {
        this.stateStore.clearState();
        this.auth.onLogin({
          userInfo: result.auth,
          token: result.token,
          permissions: this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status)
        });
        this.validateStatus = 'successful';
        this.reloadParentWindow();
      }, error => {
        this.validateStatus = 'failure';
      });
  }

  reloadParentWindow() {
    window.parent.location.reload();
  }

  resetLogin() {
    console.log('重新登录');
  }

}
