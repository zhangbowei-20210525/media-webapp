import { AccountService } from '@shared';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';
import { SocialService, ITokenModel, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

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
        <p *ngSwitchCase="'successful'">登录成功，如未自动跳转请点击<a>跳转</a></p>
        <p *ngSwitchCase="'failure'">登录失败，请重试</p>
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
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) { }

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('state') === 'STATE') { // 验证 STATE 确保结果是正常的
      this.wxloginRequest(params.get('code'));
    } else {
      this.validateStatus = 'error';
    }
  }

  wxloginRequest(code: string) {
    this.accountervice.wechatValidate(code)
      .pipe(delay(1000))
      .subscribe(result => {
        console.log(result);
        this.tokenService.set({
          token: result.token,
          time: +new Date
        });
        this.validateStatus = 'successful';
        // window.parent.location.reload();
      }, error => {
        this.validateStatus = 'failure';
      });
  }

}
