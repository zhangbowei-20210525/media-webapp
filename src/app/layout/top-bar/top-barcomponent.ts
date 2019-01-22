import { AccountService } from '@shared';
import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService, I18nService } from '@core';
import { DOCUMENT } from '@angular/common';
import { DA_SERVICE_TOKEN, ITokenService, SimpleTokenModel } from '@delon/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['../layout.less']
})
export class TopBarComponent implements OnInit {

  isLoggedIn = false;
  langs: any[];

  constructor(
    public settings: SettingsService,
    private router: Router,
    private accountService: AccountService,
    private i18n: I18nService,
    // private auth: AuthService,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,
    @Inject(DOCUMENT) private doc: any
  ) { }

  ngOnInit() {
    this.langs = this.i18n.getLangs();
    this.token.change().subscribe(t => {
      this.isLoggedIn = this.checkSimple(t);
      // console.log('token changed.', t, this.isLoggedIn);
    });
    this.isLoggedIn = this.checkSimple(this.token.get());
  }

  checkSimple(model: SimpleTokenModel): boolean {
    return model != null && typeof model.token === 'string' && model.token.length > 0;
  }

  login() {
    this.accountService.openLoginModal();
  }

  logout() {
    this.token.clear();
    this.settings.user = null;
    this.router.navigateByUrl('/');
  }

  changeLanguage(lang: string) {
    this.settings.lang = lang;
    this.i18n.use(lang);
  }

}
