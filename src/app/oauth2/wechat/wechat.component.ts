import { AccountService, TreeService } from '@shared';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';
import { SocialService, ITokenModel, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@core';

@Component({
  selector: 'app-wechat',
  template: `
    <style>
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
    }
    </style>

    <div class="container">
      <ng-container [ngSwitch]="validateStatus">
        <p *ngSwitchCase="'loading'">正在登录...</p>
        <p *ngSwitchCase="'successful'">登录成功，正在跳转...</p>
        <p *ngSwitchCase="'failure'">登录失败，请 <a (click)="reset()">重试</a></p>
        <p *ngSwitchCase="'error'">登录参数异常</p>
      </ng-container>
    </div>
  `
})
export class WechatComponent implements OnInit {

  validateStatus = 'loading';

  constructor(
    private route: ActivatedRoute,
    private accountervice: AccountService,
    private settings: SettingsService,
    private ts: TreeService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
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
    this.accountervice.wechatValidate(code)
      .subscribe(result => {
        this.settings.user = result.auth;
        this.settings.permissions = this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status);
        this.tokenService.set({
          token: result.token,
          time: +new Date
        });
        this.validateStatus = 'successful';
        window.parent.location.reload();
      }, error => {
        this.validateStatus = 'failure';
      });
  }

  wxBindRequest(code: string) {
    this.accountervice.bindWechatValidate(code)
      .subscribe(result => {
        this.settings.user = result.auth;
        this.settings.permissions = this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status);
        this.tokenService.set({
          token: result.token,
          time: +new Date
        });
        this.validateStatus = 'successful';
        window.parent.location.reload();
      }, error => {
        this.validateStatus = 'failure';
      });
  }

  reset() {
    const service = window.parent.document[AccountService.KEY] as AccountService;
    service.loginRef.modalRef.instance.createWxLoginQRCode();
  }
}
