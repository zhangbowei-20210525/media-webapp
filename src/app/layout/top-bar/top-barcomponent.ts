import { AccountService } from '@shared';
import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService, I18nService, AuthService } from '@core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['../layout.less']
})
export class TopBarComponent implements OnInit {

  isLoggedIn = false;
  langs: any[];

  constructor(
    private accountService: AccountService,
    private settings: SettingsService,
    private i18n: I18nService,
    private auth: AuthService,
    @Inject(DOCUMENT) private doc: any
  ) { }

  ngOnInit() {
    this.langs = this.i18n.getLangs();
    this.isLoggedIn = true;
    // this.isLoggedIn = this.auth.isLoggedIn;
    // this.auth.notify.subscribe(status => {
    //   this.isLoggedIn = status;
    // });
  }

  openLogin() {
    this.accountService.openLoginModal();
  }

  changeLanguage(lang: string) {
    this.settings.lang = lang;
    this.i18n.use(lang);
  }

}
