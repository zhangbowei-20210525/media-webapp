import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { AccountService } from '@shared';

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
      this.router.navigate([`/manage/series`]);
    });
  }

  marketDetail() {
    this.router.navigate([`/d`]);
  }
}
