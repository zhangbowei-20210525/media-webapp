import { AccountService } from '@shared';
import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService, I18nService } from '@core';
import { DOCUMENT } from '@angular/common';
import { DA_SERVICE_TOKEN, ITokenService, SimpleTokenModel } from '@delon/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { QueueUploader } from '@shared/upload';
import { ACLAbility } from '@core/acl';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  langs: any[];
  uploads: number;

  constructor(
    public ability: ACLAbility,
    public settings: SettingsService,
    private router: Router,
    private accountService: AccountService,
    private i18n: I18nService,
    private uploader: QueueUploader,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,
    @Inject(DOCUMENT) private doc: any,
    private acl: ACLService
  ) {
    console.log('can', ability.program.view, acl.canAbility({ ability: [ability.program.view] }));
    this.acl.change.subscribe(data => {
      console.log(data);
    });
  }

  ngOnInit() {
    this.langs = this.i18n.getLangs();
    this.token.change().subscribe(t => {
      this.isLoggedIn = this.checkSimple(t);
    });
    this.isLoggedIn = this.checkSimple(this.token.get());
    this.uploader.change$.subscribe(n => this.uploads = n);
  }

  checkSimple(model: SimpleTokenModel): boolean {
    return model != null && typeof model.token === 'string' && model.token.length > 0;
  }

  login() {
    this.accountService.openLoginModal().then(() => {
      this.router.navigate([`/manage/series`]);
    });
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
