import { finalize, delay } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotifyService } from './notify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationDto, MessageService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { NotifiesPolling } from '@core/notifies';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';
import { SystemMessagesComponent } from '../system-messages/system-messages.component';
import { TapeMessagesComponent } from '../tape-messages/tape-messages.component';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.less']
})
export class NotifyComponent implements OnInit {
  validateForm: FormGroup;
  choseCompany = '';
  disparCompany = '';
  sysPagination = { page: 1, page_size: 10 } as PaginationDto;
  srcPagination = { page: 1, page_size: 10 } as PaginationDto;
  outPagination = { page: 1, page_size: 10 } as PaginationDto;

  isSysLoaded = false;
  isSrcLoaded = false;
  isOutLoaded = false;

  isSysLoding = false;
  isSrcLoding = false;
  isOutLoding = false;

  sysUnread = 0;
  srcUnread = 0;
  outUnread = 0;

  sysNotifys = [];
  srcNotifys = [];
  outNotifys = [];

  tabIndex = 0;
  visible = false;
  drawerTitle: string;
  drawerCreated_at: string;
  drawerContent: string;
  acceptCompany: string;
  authInfo: any;
  related_id: number;
  type: string;
  isShowInput = false;
  isShowRadio = false;
  companyList = [];
  companyId: number;
  acceptCompanyId: number;
  publicity: any;
  created_employee: any;
  disperCompanyName: any;
  shareId: any;
  typeId: any;
  id: any;
  company: any;
  typeCompany: any;
  grantId: any;
  isChoseShow = false;
  isDisparShow = false;
  ref: NzModalRef;

  constructor(
    private service: NotifyService,
    private message: MessageService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private np: NotifiesPolling,
    private model: NzModalService
  ) {
    const subscription = this.np.notifies().subscribe(result => {
      this.sysUnread = result.base.notify.unread_system_num;
      this.srcUnread = result.base.notify.unread_source_num;
      this.outUnread = result.base.notify.unread_outside_num;
      const sort = [{ tab: 0, unread: this.sysUnread }, { tab: 1, unread: this.srcUnread }, { tab: 2, unread: this.outUnread }];
      sort.sort((a, b) => a.unread - b.unread).reverse();
      this.tabIndex = sort[0].tab;
      subscription.unsubscribe();
    });
    this.np.nextNotifies();
  }

  ngOnInit() {
    this.fetchSysNotifys();
    // this.validateForm = this.fb.group({
    //   companyFullName: [null, [Validators.required]],
    //   phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
    //   companyName: [null, [Validators.required]],
    //   customType: ['1', [Validators.required]]
    // });
  }

  fetchSysNotifys() {
    this.isSysLoding = true;
    this.service.getSystemNotify(this.sysPagination)
      .pipe(finalize(() => {
        this.isSysLoding = false;
        if (!this.isSysLoaded) {
          this.isSysLoaded = true;
        }
      }))
      .subscribe(result => {
        this.sysNotifys = [...this.sysNotifys, ...result.list];
        this.sysPagination.count = result.pagination.count;
        this.sysPagination.pages = result.pagination.pages;
      });
  }

  fetchSrcNotifys() {
    this.isSrcLoding = true;
    this.service.getSourceNotify(this.srcPagination)
      .pipe(finalize(() => {
        this.isSrcLoding = false;
        if (!this.isSrcLoaded) {
          this.isSrcLoaded = true;
        }
      }))
      .subscribe(result => {
        this.srcNotifys = [...this.srcNotifys, ...result.list];
        this.srcPagination.count = result.pagination.count;
        this.srcPagination.pages = result.pagination.pages;
      });
  }

  // validation() {
  //   const form = this.validateForm;
  //   for (const i in form.controls) {
  //     if (form.controls.hasOwnProperty(i)) {
  //       const control = form.controls[i];
  //       control.markAsDirty();
  //       control.updateValueAndValidity();
  //     }
  //   }
  //   return form.valid;
  // }

  fetchOutNotifys() {
    this.isOutLoding = true;
    this.service.getOutsideNotify(this.outPagination)
      .pipe(finalize(() => {
        this.isOutLoding = false;
        if (!this.isOutLoaded) {
          this.isOutLoaded = true;
        }
      }))
      .subscribe(result => {
        this.outNotifys = [...this.outNotifys, ...result.list];
        this.outPagination.count = result.pagination.count;
        this.outPagination.pages = result.pagination.pages;
      });
  }

  onSysScrollDown() {
    if (this.isSysLoaded && !this.isSysLoding && this.sysPagination.pages > this.sysPagination.page) {
      this.sysPagination.page += 1;
      this.fetchSysNotifys();
    }
  }

  onSrcScrollDown() {
    if (this.isSrcLoaded && !this.isSrcLoding && this.srcPagination.pages > this.srcPagination.page) {
      this.srcPagination.page += 1;
      this.fetchSrcNotifys();
    }
  }

  onOutScrollDown() {
    if (this.isOutLoaded && !this.isOutLoding && this.outPagination.pages > this.outPagination.page) {
      this.outPagination.page += 1;
      this.fetchOutNotifys();
    }
  }

  onTabChange(event: any) {
    if (event.index === 1) {
      if (!this.isSrcLoaded) {
        this.fetchSrcNotifys();
      }
    } else if (event.index === 2) {
      if (!this.isOutLoaded) {
        this.fetchOutNotifys();
      }
    }
  }

  close() {
    this.visible = false;
  }
  // 获取宣发分享信息
  // messageShareDetails(title: string, created_at: string, content: string, id: number, type: string) {
  //   this.visible = true;
  //   this.drawerTitle = title;
  //   this.drawerCreated_at = created_at;
  //   this.drawerContent = content;
  //   this.related_id = id;
  //   this.type = type;
  //   if (type === 'PUB001') {
  //     this.service.getSharingInfo(this.related_id).subscribe(res => {
  //       console.log(res);
  //       this.id = res.id;
  //       this.publicity = res.publicity;
  //       this.created_employee = res.created_employee;
  //       this.company = res.liaison.custom.name;
  //       this.validateForm.get('companyName').setValue(res.liaison.custom.name);
  //       this.disperCompanyName = this.validateForm.get('companyName').setValue(res.liaison.custom.name);
  //       this.validateForm.get('phone').setValue(res.liaison.phone);
  //       this.validateForm.get('phone').disable();
  //       this.service.getCompanyList().subscribe(cl => {
  //         console.log(cl);
  //         this.companyList = cl;
  //         this.acceptCompany = res.company_full_name;
  //         console.log(this.acceptCompany);
  //       });
  //     });
  //   }
  // }

  messageShareDetails(title: string, created_at: string, content: string, id: number, type: string) {
    this.type = type;
    this.related_id = id;
    console.log(type);
    if (type === 'PUB001') {
      this.model.create({
        nzTitle: `系统消息：${title}`,
        nzContent: SystemMessagesComponent,
        nzComponentParams: { created_at: created_at, content: content, id: id, type: type },
        nzMaskClosable: false,
        nzClosable: false,
        nzOkText: '确认接收公司',
        nzCancelText: '拒绝',
        nzWidth: 800,
        nzOnCancel: () => this.sharedRefused(),
        nzOnOk: this.showSystemMessagesAgreed,
        nzNoAnimation: true
      });
    } else {
     this.ref =  this.model.create({
        nzTitle: `系统消息：${title}`,
        nzContent: SystemMessagesComponent,
        nzComponentParams: { created_at: created_at, content: content, id: id, type: type },
        nzMaskClosable: false,
        nzClosable: false,
        nzOkText: '确认',
        nzCancelText: '取消',
        nzWidth: 800,
        nzOnOk: () => this.ref.destroy(),
        nzNoAnimation: true
      });
    }
  }


  showSystemMessagesAgreed = (component: SystemMessagesComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('成功分享'));
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })


  // 获取母带授权信息
  messageDetails(title: string, created_at: string, content: string, id: number, type: string) {
    // this.visible = true;
    // this.drawerTitle = title;
    // this.drawerCreated_at = created_at;
    // this.drawerContent = content;
    this.related_id = id;
    this.type = type;
    if (type === 'SOU005') {
      this.model.create({
        nzTitle: `${title}`,
        nzContent: TapeMessagesComponent,
        nzComponentParams: { created_at: created_at, content: content, id: id, type: type },
        nzMaskClosable: false,
        nzClosable: false,
        nzOkText: '确认接受',
        nzCancelText: '拒绝',
        nzWidth: 800,
        nzOnCancel: () => this.refused(),
        nzOnOk: this.showTapeMessagesAgreed,
        nzNoAnimation: true
      });
    } else {
     this.ref =  this.model.create({
        nzTitle: `${title}`,
        nzContent: TapeMessagesComponent,
        nzComponentParams: { created_at: created_at, content: content, id: id, type: type },
        nzMaskClosable: false,
        nzClosable: false,
        nzOkText: '确认',
        nzCancelText: '取消',
        nzWidth: 800,
        nzOnOk: () => this.ref.destroy(),
        nzNoAnimation: true
      });
    }
  }

  showTapeMessagesAgreed = (component: TapeMessagesComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('global.accept-authorization-successfully'));
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })


  // 母带授权接受
  // submit() {
  //   const status = true;
  //   if (this.typeId === undefined) {
  //     console.log(this.typeId);
  //     this.typeId = '';
  //     // this.message.warning('您已拒绝请勿重复操作');
  //   }
  //   this.service.pubAuth(status, this.typeId, this.typeCompany, this.related_id).subscribe(res => {
  //     this.message.success(this.translate.instant('global.accept-authorization-successfully'));
  //     this.visible = false;
  //   });
  // }
  // 母带授权拒绝
  refused() {
    const status = false;
    if (this.type === 'SOU005') {
      this.service.pubAuth(status, this.typeId, this.typeCompany, this.related_id).subscribe(res => {
        this.message.warning(this.translate.instant('global.refused-authorization-information'));
        // this.visible = false;
      });
    }
  }
  // 宣发分享接受
  // sharedSubmit() {
  //   console.log(this.company);
  //   const status = true;
  //   console.log(this.shareId === undefined);
  //   if (this.shareId === undefined) {
  //     this.shareId = '';
  //     console.log(this.shareId);
  //   }
  //   this.service.getAccept(status, this.shareId, this.company, this.id).subscribe(res => {
  //     this.message.success(this.translate.instant('成功分享'));
  //     this.visible = false;
  //   });
  // }
  // 宣发分享拒绝
  sharedRefused() {
    const status = false;
    if (this.type === 'PUB001') {
      this.service.getSharingInfo(this.related_id).subscribe(res => {
        this.id = res.id;
        this.service.getAccept(status, this.shareId, this.company, this.id).subscribe(r => {
          this.message.warning(this.translate.instant('拒绝分享'));
        });
      });
    }
  }
  onDisperChange(data) {
    console.log(data);
    this.shareId = data;
    if (!!data) {
      this.isDisparShow = true;
    } else {
      this.isDisparShow = false;
    }
  }
  onChoseCompany(data) {
    console.log(data);
    this.typeId = data;
    if (!!data) {
      this.isChoseShow = true;
    } else {
      this.isChoseShow = false;
    }
  }
}
