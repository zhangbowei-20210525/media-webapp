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
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['../layout.less']
})
export class TopBarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  langs: any[];
  status = false;
  uploads: number;
  upload: number;
  sourceUpload: number;
  sourceUploads = [];
  uploadsLength: number;
  sourceUploadsPagination = { page: 1, page_size: 10 } as PaginationDto;
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
    this.uploader.change$.subscribe(n => this.upload = n);
    this.uploader.change$.subscribe(n => {
      this.upload = n;
      this.uploads = this.upload + this.uploadsLength;
      console.log(this.uploads);
      });
    });
    this.isLoggedIn = this.checkSimple(this.token.get());
    // this.setUploadsTime();
    this.service.changeType$.subscribe(n => {
      console.log(n, '我必须执行才行啊');
      this.uploadsLength = n;
      this.uploads = this.upload + this.uploadsLength;
    });
// 
  }
  // getUploadsProgress() {
  //   this.service.getNotifiesUploads().subscribe(result => {
  //     this.uploadsLength = result.active_source_task_num;
  //     this.uploads = this.upload + this.uploadsLength;
  //     console.log(this.uploads, 'ccc');
  //   });
  // }
  // setUploadsTime() {
  //   this.getUploadsProgress();
  //   console.log(this.uploads, 'aaa');
  //   this.timers = setInterval(() => {
  //     this.getUploadsProgress();
  //     console.log(this.uploads, 'bbb');
  //     if (this.uploads !== 0) {
  //         this.status = true;
  //     }
  //   }, 10000);
  //   // ````````````````````````````````````````````````111
  //   // const observable = dataSource => {
  //   //   const INTERVAL = 5000 ;
  //   //   let schedulerId ;
  //   //   return {
  //   //     subscribe : observer => {
  //   //       schedulerId = setInterval(() => {
  //   //         if ( dataSource = 0 ) {
  //   //           observer.complete();
  //   //           clearInterval(schedulerId);
  //   //           schedulerId = undefined;
  //   //         } esle {
  //   //           observer.next(dataSource.shift());
  //   //         }
  //   //       }, INTERVAL);
  //   //       return {
  //   //         unsubscribe : () => {
  //   //           if (schedulerId) {
  //   //             clearInterval(schedulerId);
  //   //           }
  //   //         }
  //   //       };
  //   //     }
  //   //   };
  //   // };
  // }

  ngOnDestroy() {
    if (this.status && this.uploads === 0) {
      clearInterval(this.timers);
      }
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
// const observable = dataSource => {
  //   const INTERVAL = 1000;
  //   let schedulerId;
    
  //   return {
  //     subscribe: observer => {//接受一个observer作为参数
  //       schedulerId = setInterval(() => {
  //         if(dataSource.length === 0) {
  //           observer.complete();//通知observer数据(事件)全部发送完毕
  //           clearInterval(schedulerId);
  //           schedulerId = undefined;
  //         } else {
  //           observer.next(dataSource.shift());//把数据(事件)传递给observer
  //         }
  //       }, INTERVAL);
        
  //       return {//返回一个对象，我们可以称之为subscription，包含一个取消订阅的函数
  //         unsubscribe: () => {//取消订阅，将不再发送数据(事件)给observer
  //           if(schedulerId) {
  //             clearInterval(schedulerId);
  //           }
  //         }
  //       };
  //     }
  //   }
  // };
  //     observable([1, 2, 3]).subscribe({//传递给subscribe函数observer对象
  //       next: console.log,//包含next函数
  //       complete: () => console.log('事件全部发送完毕')//包含complete函数
  //     });