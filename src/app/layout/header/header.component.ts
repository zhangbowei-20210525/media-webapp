import { AccountService } from '@shared';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { SettingsService, I18nService } from '@core';
import { DOCUMENT } from '@angular/common';
import { DA_SERVICE_TOKEN, ITokenService, SimpleTokenModel } from '@delon/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from './header.service';
import { QueueUploader } from '@shared/upload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  langs: any[];
  uploads: number;
  upload: number;
  sourceUpload: number;
  sourceUploads = [];
  uploadsLength: number;
  uploadStatus: any;
  activeSourceTasks = false;
  subscription: Subscription;

  constructor(
    public settings: SettingsService,
    private uploader: QueueUploader,
    private router: Router,
    private accountService: AccountService,
    private i18n: I18nService,
    private service: HeaderService,
    // private userSource : Subject<result>
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,
    @Inject(DOCUMENT) private doc: any
  ) { }

  ngOnInit() {
    this.langs = this.i18n.getLangs();
    this.token.change().subscribe(t => {
      this.isLoggedIn = this.checkSimple(t);
      // this.uploader.change$.subscribe(n => this.upload = n);
      this.uploader.change$.subscribe(n => {
        this.upload = n;
        this.uploads = this.upload + this.uploadsLength;
        console.log(this.uploads);
      });
    });
    this.isLoggedIn = this.checkSimple(this.token.get());
    this.service.startNotifiesPolling();
    this.subscription = this.service.notifies().subscribe(result => {
      this.sourceUploads = result.active_source_tasks;
      this.uploadsLength = result.base.source.active_source_task_num;
      this.uploads = this.upload + this.uploadsLength;
    })
  }
  ngOnDestroy() {
    this.service.stopNotifiesPolling();
    this.subscription.unsubscribe();
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