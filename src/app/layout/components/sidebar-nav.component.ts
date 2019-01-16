import { LoginService } from 'src/app/shared';
import { Component, OnInit } from '@angular/core';
import { SettingsService, I18nService } from 'src/app/core';

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar.less']
})
export class SidebarNavComponent implements OnInit {

  isLoggedIn = false;
  langs: any[];

  constructor(
    private loginService: LoginService,
    private settings: SettingsService,
    private i18n: I18nService,
  ) { }

  ngOnInit() {
    this.langs = this.i18n.getLangs();
  }

  openLogin() {
    // this.isLoggedIn = true;
    this.loginService.open();
  }

  changeLanguage(lang: string) {
    this.settings.lang = lang;
    this.i18n.use(lang);
  }

}
