import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { AccountService } from '@shared';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.less']
})
export class MarketComponent implements OnInit {

  constructor(
    private router: Router,
    private account: AccountService,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    // console.log(this.token.get());
    if (this.token.get().token) {
      this.router.navigateByUrl('/manage/dashboard');
    } else {
      this.login();
    }
  }

  login() {
    this.account.openLoginModal().then(() => {
      if (this.token.get().is_new_user === true) {
        if (this.token.get().receipt_source_auth > 0) {
          this.modal.confirm({
            nzTitle: '您有一条新的授权信息，是否前往查看?',
            nzOkText: '前往',
            nzCancelText: '跳过',
            nzOkType: 'primary',
            nzOnCancel: () => new Promise((resolve) => {
              resolve();
              this.navigateToDefault();
            }),
            nzOnOk: () => new Promise((resolve) => {
              resolve();
              this.router.navigate([`/manage/pubAuthorizationReceive`]);
            })
          });
        } else {
          this.navigateToDefault();
        }
      } else {
        this.navigateToDefault();
      }
    });
  }

  navigateToDefault() {
    this.router.navigate([`/manage/dashboard`]);
  }

  marketDetail() {
    this.router.navigate([`/d`]);
  }
}
