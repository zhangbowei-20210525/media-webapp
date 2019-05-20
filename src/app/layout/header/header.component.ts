import { AccountService } from '@shared';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { SettingsService, I18nService } from '@core';
import { DOCUMENT } from '@angular/common';
import { DA_SERVICE_TOKEN, ITokenService, SimpleTokenModel } from '@delon/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationDto } from '@shared';
import { TopBarService } from './top-bar.service';
import { QueueUploader } from '@shared/upload';
// import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  langs: any[];
  // status = false;
  uploads: number;
  upload: number;
  sourceUpload: number;
  sourceUploads = [];
  uploadsLength: number;
  uploadStatus: any;
  activeSourceTasks = true;
  // sourceUploadsPagination = { page: 1, page_size: 10, } as PaginationDto;
  // sourceUploadsPagination = { active_source_tasks : 1} as PaginationDto;
  // activeSourceTasks = { active_source_tasks : 1}
  // private timers;
  // observable: Observable;
  timers: any;
  // schedulerId = this.timers;
  // dataSource = this.uploads;
  constructor(
    public settings: SettingsService,
    private uploader: QueueUploader,
    private router: Router,
    private accountService: AccountService,
    private i18n: I18nService,
    private service: TopBarService,
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
    // this.setUploadsTime();
    this.getUploadsProgress()
    // this.service.changeType$.subscribe(n => {
    //   console.log(n, '我必须执行才行啊');
      // this.uploadsLength = n;
      // this.uploads = this.upload + this.uploadsLength;
    // });
// 
  } 
  getUploadsProgress() {
    this.service.getNotifiesUploads(this.activeSourceTasks).subscribe(result => {
      this.sourceUploads = result.active_source_tasks;
      console.log(result);
      // this.uploadsLength = result.base.active_source_task_num;
      // console.log( this.uploadsLength)
      // this.uploadStatus = result.base.has_active_source_task;
      // console.log( this.uploadStatus)
      // this.uploads = this.upload + this.uploadsLength;
      // console.log(this.uploads, 'ccc');
    });
  }
  // setUploadsTime() {
    // this.getUploadsProgress();
    // console.log(this.uploads, 'aaa');
    // this.timers = setInterval(() => {
      // this.getUploadsProgress();
      // console.log(this.uploads, 'bbb');
      // if (this.uploads !== 0) {
          // this.status = true;
      // }
    // }, 5000);
  // }

  ngOnDestroy() {
    // if (this.status && this.uploads === 0) {
      // clearInterval(this.timers);
      // }
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