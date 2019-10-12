import { AccountService } from '@shared';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { SettingsService, I18nService, AuthService } from '@core';
import { DOCUMENT } from '@angular/common';
import { DA_SERVICE_TOKEN, ITokenService, SimpleTokenModel } from '@delon/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { QueueUploader } from '@shared/upload';
import { ACLAbility } from '@core/acl';
import { ACLService } from '@delon/acl';
import { Subscription } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd';
import { NotifiesPolling } from '@core/notifies';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  langs: any[];
  uploads: number;
  upload: number;
  sourceUpload: number;
  sourceUploads = [];
  notifies: number;
  uploadsLength: number;
  uploadStatus: any;
  activeSourceTasks = false;
  subscription: Subscription;
  companyName: '';
  token: '';

  constructor(
    public ability: ACLAbility,
    public settings: SettingsService,
    private uploader: QueueUploader,
    private modal: NzModalService,
    private router: Router,
    private accountService: AccountService,
    private i18n: I18nService,
    private ntf: NotifiesPolling,
    // private userSource : Subject<result>
    private auth: AuthService,
    @Inject(DOCUMENT) private doc: any,
    private acl: ACLService
  ) {
    // console.log('can', ability.program.view, acl.canAbility({ ability: [ability.program.view] }));
    // this.acl.change.subscribe(data => {
    //   console.log(data);
    // });
  }

  ngOnInit() {
   this.companyName = JSON.parse(localStorage.getItem('_user')).company_name;
   this.token = JSON.parse(localStorage.getItem('_token')).token;
    this.langs = this.i18n.getLangs();
    this.auth.state$.subscribe(state => {
      this.isLoggedIn = state;
      // this.uploader.change$.subscribe(n => this.upload = n);
      this.uploader.change$.subscribe(n => {
        this.upload = n;
        this.uploads = this.upload + this.uploadsLength;
        // console.log(this.uploads);
      });
    });
    this.isLoggedIn = this.auth.isLoggedIn;
    this.subscription = this.ntf.notifies().subscribe(result => {
      this.sourceUploads = result.active_source_tasks;
      this.uploadsLength = result.base.source.active_source_task_num;
      this.notifies = result.base.notify.unread_num;
      this.uploads = this.upload + this.uploadsLength;
    });
    if (this.isLoggedIn) {
      this.ntf.startNotifiesPolling();
    }
    // console.log(this.settings);
    // console.log(this.settings.user.company_name);
  }

  ngOnDestroy() {
    this.ntf.stopNotifiesPolling();
    this.subscription.unsubscribe();
  }

  login() {
    this.accountService.openLoginModal().then(() => {
    // console.log(this.token.get().callback.status === 'publicity_share');
      this.router.navigate([`/manage/dashboard`]);
      // if (this.token.get().callback.status === 'source_auth') {
      //     this.modal.confirm({
      //       nzTitle: '您有一条新的授权信息，是否前往查看?',
      //       nzOkText: '前往',
      //       nzCancelText: '跳过',
      //       nzOkType: 'primary',
      //       nzOnCancel: () => new Promise((resolve) => {
      //         resolve();
      //         this.navigateToDefault();
      //       }),
      //       nzOnOk: () => new Promise((resolve) => {
      //         resolve();
      //         this.router.navigate([`/manage/pubAuthorizationReceive`]);
      //       })
      //     });
      //   } else if ((this.token.get().callback.status === 'publicity_share')) {
      //     this.modal.confirm({
      //       nzTitle: '您有一条新的接收信息，是否前往查看?',
      //       nzOkText: '前往',
      //       nzCancelText: '跳过',
      //       nzOkType: 'primary',
      //       nzOnCancel: () => new Promise((resolve) => {
      //         resolve();
      //         this.navigateToDefault();
      //       }),
      //       nzOnOk: () => new Promise((resolve) => {
      //         resolve();
      //         this.router.navigate([`/manage/DeclareAuthorizationReceive`]);
      //       })
      //     });
      // } else {
      //   this.navigateToDefault();
      // }
    });
  }

  navigateToDefault() {
    this.router.navigate([`/manage/dashboard`]);
  }

  logout() {
    this.auth.onLogout();
    this.router.navigateByUrl('/passport/login');
  }

  changeLanguage(lang: string) {
    this.settings.lang = lang;
    this.i18n.use(lang);
  }

  goBigData() {
    window.open(`http://data.bctop.net?companyName=${this.companyName}&token=${this.token}`);
  }

}
