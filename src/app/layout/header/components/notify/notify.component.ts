import { finalize, delay } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotifyService } from './notify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaginationDto, MessageService, TreeService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { NotifiesPolling } from '@core/notifies';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';
import { SystemMessagesComponent } from '../system-messages/system-messages.component';
import { TapeMessagesComponent } from '../tape-messages/tape-messages.component';
import { Router } from '@angular/router';
import { AuthService } from '@core';
import { SolicitationComponent } from '../solicitation/solicitation.component';
import { TransmitService } from 'app/routes/manage/transmit/transmit.service';
import { TransmitScheduleComponent } from 'app/routes/manage/transmit/components/transmit-schedule/transmit-schedule.component';
import { ProcessComponent } from '../process/process.component';
import { EmployeesInvitedMessagesComponent } from '../employees-invited-messages/employees-invited-messages.component';
import { ReviewPeopleMessageComponent } from '../review-people-message/review-people-message.component';
import { DeliveryCopyrightMessagesComponent } from '../delivery-copyright-messages/delivery-copyright-messages.component';

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
  is_process: boolean;
  typeId: any;
  id: any;
  company: any;
  typeCompany: any;
  grantId: any;
  isChoseShow = false;
  isDisparShow = false;
  ref: NzModalRef;
  isdisableButton = false;

  constructor(
    private service: NotifyService,
    private message: MessageService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private np: NotifiesPolling,
    private model: NzModalService,
    private router: Router,
    private auth: AuthService,
    private ts: TreeService,
    private emitService: TransmitService,
    private modalService: NzModalService,
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
  //       this.id = res.id;
  //       this.publicity = res.publicity;
  //       this.created_employee = res.created_employee;
  //       this.company = res.liaison.custom.name;
  //       this.validateForm.get('companyName').setValue(res.liaison.custom.name);
  //       this.disperCompanyName = this.validateForm.get('companyName').setValue(res.liaison.custom.name);
  //       this.validateForm.get('phone').setValue(res.liaison.phone);
  //       this.validateForm.get('phone').disable();
  //       this.service.getCompanyList().subscribe(cl => {
  //         this.companyList = cl;
  //         this.acceptCompany = res.company_full_name;
  //       });
  //     });
  //   }
  // }

  messageShareDetails(title: string, created_at: string, content: string, id: number, type: string, info: any) {
    this.type = type;
    console.log('34343434');
    console.log(type);
    this.related_id = id;
    if (type === 'PUB002') {
      this.service.getSolicitationInfo(id).subscribe(result => {
        if (result.expire_days < 0) {
          this.isdisableButton = true;
        }
        this.model.create({
          nzTitle: `宣发征集令`,
          nzContent: SolicitationComponent,
          nzComponentParams: { info: info },
          nzMaskClosable: false,
          nzClosable: false,
          nzOkText: '上传样片',
          nzOkDisabled: this.isdisableButton,
          nzCancelText: '取消',
          nzWidth: 800,
          nzOnOk: this.solicitationAgreed,
          nzNoAnimation: true
        });
      });
    }

    // 邀请企业 消息
    if (type === 'SYS008') {
      this.router.navigate([`/manage/teams/interconnection-enterprises`]);
    }

    if (type === 'PUB001') {
      this.model.create({
        nzTitle: `${title}`,
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
    }

    if (type === 'SYS005') {
      this.service.getEmployeesInvitedInfo(id).subscribe(result => {
        if (result.is_joined === false && result.is_delete === false) {
          this.model.create({
            nzTitle: `员工申请`,
            nzContent: EmployeesInvitedMessagesComponent,
            nzComponentParams: { info: info },
            nzMaskClosable: false,
            nzClosable: false,
            nzOkText: '加入',
            nzCancelText: '拒绝',
            nzWidth: 800,
            nzOnOk: this.eimAgreed,
            nzOnCancel: this.eimRefused,
            nzNoAnimation: true
          });
        } else {
          this.model.create({
            nzTitle: `员工申请`,
            nzContent: EmployeesInvitedMessagesComponent,
            nzComponentParams: { info: info },
            nzMaskClosable: false,
            nzClosable: false,
            nzOkText: '确认',
            nzCancelText: null,
            nzOnOk: this.escEim,
            nzWidth: 800,
            nzNoAnimation: true
          });
        }
      });
    }

    if (type === 'SYS006') {
      this.service.getEmployeesInvitedInfo(id).subscribe(result => {
        if (result.is_joined === false && result.is_delete === false) {
          this.model.create({
            nzTitle: `外部审片人申请`,
            nzContent: ReviewPeopleMessageComponent,
            nzComponentParams: { info: info },
            nzMaskClosable: false,
            nzClosable: false,
            nzOkText: '加入',
            nzCancelText: '拒绝',
            nzWidth: 800,
            nzOnOk: this.rpmAgreed,
            nzOnCancel: this.rpmRefused,
            nzNoAnimation: true
          });
        } else {
          this.model.create({
            nzTitle: `外部审片人申请`,
            nzContent: ReviewPeopleMessageComponent,
            nzComponentParams: { info: info },
            nzMaskClosable: false,
            nzClosable: false,
            nzOkText: '确认',
            nzCancelText: null,
            nzOnOk: this.escRpm,
            nzWidth: 800,
            nzNoAnimation: true
          });
        }
      });
    }

    if (type !== 'PUB001' && type !== 'PUB002' && type !== 'SYS005' && type !== 'SYS006' && type !== 'SYS008') {
      this.ref = this.model.create({
        nzTitle: `${title}`,
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

  escEim = (component: EmployeesInvitedMessagesComponent) => new Promise((resolve, reject) => {
    resolve();
  })

  eimRefused = (component: EmployeesInvitedMessagesComponent) => new Promise((resolve, reject) => {
    this.service.eimDetermine(this.related_id, false).subscribe(result => {
      resolve();
      this.message.warning(this.translate.instant('已拒绝'));
    });
  })

  eimAgreed = (component: EmployeesInvitedMessagesComponent) => new Promise((resolve, reject) => {
    this.service.eimDetermine(this.related_id, true).subscribe(result => {
      resolve();
      this.message.success(this.translate.instant('已加入成功'));
    });
  })


  escRpm = (component: ReviewPeopleMessageComponent) => new Promise((resolve, reject) => {
    resolve();
  })

  rpmRefused = (component: ReviewPeopleMessageComponent) => new Promise((resolve, reject) => {
    this.service.eimDetermine(this.related_id, false).subscribe(result => {
      resolve();
      this.message.warning(this.translate.instant('已拒绝'));
    });
  })

  rpmAgreed = (component: ReviewPeopleMessageComponent) => new Promise((resolve, reject) => {
    this.service.eimDetermine(this.related_id, true).subscribe(result => {
      resolve();
      this.message.success(this.translate.instant('已加入成功'));
    });
  })

  solicitationAgreed = (component: SolicitationComponent) => new Promise((resolve, reject) => {
    resolve();
    this.router.navigate([`/manage/image/details-solicitation/${this.related_id}`]);
    // if (component.validation()) {
    //   component.submit()
    //     .subscribe(result => {
    //       // this.message.success(this.translate.instant('成功分享'));
    //       this.router.navigate([`/manage/transmit/type`]);
    //       resolve();
    //     }, error => {
    //       reject(false);
    //     });
    // } else {
    //   reject(false);
    // }
  })


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

  externalMessageDetails(name: string, id: number, type: string) {
    this.modalService.confirm({
      nzTitle: `是否切换到${name}`,
      // nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => {
        this.service.switchCompany(id).subscribe(res => {
          this.auth.onLogin({
            token: res.token,
            userInfo: res.auth,
            permissions: this.ts.recursionNodesMapArray(res.permissions, p => p.code, p => p.status)
          });
          this.router.navigate([`/manage/dashboard`]);
        });
      }
    });
  }

  // 获取母带授权信息
  messageDetails(title: string, created_at: string, content: string, id: number, idd: number, type: string, is_process: boolean) {
    // this.visible = true;
    // this.drawerTitle = title;
    // this.drawerCreated_at = created_at;
    // this.drawerContent = content;
    this.related_id = id;
    this.type = type;
    this.is_process = is_process;
    if (type === 'SOU005') {
      if (is_process === true) {
        this.ref = this.model.create({
          nzTitle: `${title}`,
          nzContent: TapeMessagesComponent,
          nzComponentParams: { created_at: created_at, content: content, id: id, type: type, is_process: is_process },
          nzMaskClosable: false,
          nzClosable: false,
          nzOkText: '确认',
          nzCancelText: null,
          nzWidth: 800,
          // nzOnCancel: () => this.refused(),
          nzOnOk: () => this.ref.close(),
          nzNoAnimation: true
        });
      }

      if (is_process === false) {
        this.model.create({
          nzTitle: `${title}`,
          nzContent: TapeMessagesComponent,
          nzComponentParams: { created_at: created_at, content: content, id: id, type: type, is_process: is_process },
          nzMaskClosable: false,
          nzClosable: false,
          nzOkText: '确认接受',
          nzCancelText: '拒绝',
          nzWidth: 800,
          nzOnCancel: () => this.refused(),
          nzOnOk: (c) => this.showTapeMessagesAgreed(c, idd),
          nzNoAnimation: true
        });
      }
    } else if (type === 'SOU001' || type === 'SOU003') {
      this.modalService.create({
        nzTitle: `进度信息`,
        nzContent: ProcessComponent,
        nzComponentParams: { id: id },
        nzMaskClosable: true,
        nzClosable: true,
        nzCancelText: null,
        nzOkText: null,
        nzWidth: 800,
      });
    } else if (type === 'SOU007') {
      // 交付版权消息
      if (is_process === true) {
        this.ref = this.model.create({
          nzTitle: `母带交付版权`,
          nzContent: DeliveryCopyrightMessagesComponent,
          nzComponentParams: { created_at: created_at, content: content, id: id, type: type, is_process: is_process },
          nzMaskClosable: false,
          nzClosable: false,
          nzOkText: '确认',
          nzCancelText: null,
          nzWidth: 800,
          // nzOnCancel: () => this.refused(),
          nzOnOk: () => this.ref.close(),
          nzNoAnimation: true
        });
      }

      if (is_process === false) {
        this.model.create({
          nzTitle: `母带交付版权`,
          nzContent: DeliveryCopyrightMessagesComponent,
          nzComponentParams: { created_at: created_at, content: content, id: id, type: type, is_process: is_process },
          nzMaskClosable: false,
          nzClosable: false,
          nzOkText: '确认接受',
          nzCancelText: '拒绝',
          nzWidth: 800,
          nzOnCancel: () => this.dcRefused(),
          nzOnOk: (c) => this.dcMessagesAgreed(c, idd),
          nzNoAnimation: true
        });
      }
    } else {
      this.ref = this.model.create({
        nzTitle: `${title}`,
        nzContent: TapeMessagesComponent,
        nzComponentParams: { created_at: created_at, content: content, id: id, type: type, is_process: is_process },
        nzMaskClosable: false,
        nzClosable: false,
        nzOkText: '确认',
        nzCancelText: null,
        nzWidth: 800,
        nzOnOk: () => this.ref.close(),
        nzNoAnimation: true
      });
    }
  }

  dcRefused() {
    const status = false;
    if (this.type === 'SOU007') {
      this.service.dcRefused(status, this.related_id).subscribe(res => {
        this.message.warning('已拒绝其交付版权');
      });
    }
  }

  dcMessagesAgreed = (component: DeliveryCopyrightMessagesComponent, id: number) => new Promise((resolve, reject) => {
    const status = true;
    if (this.type === 'SOU007') {
      this.service.dcRefused(status, this.related_id).subscribe(res => {
        this.message.warning('已成功接受其版权');
        resolve();
      });
    }

  })

  showTapeMessagesAgreed = (component: TapeMessagesComponent, id: number) => new Promise((resolve, reject) => {
    const setNotifyProcess = () => {
      this.srcNotifys.find(item => item.id === id).is_process = true;
    };
    if (component.show() === false) {
      component.submit()
        .subscribe(result => {
          resolve();
          setNotifyProcess();
          this.message.success('已成功接收授权');
        }, error => {
          reject(false);
        });
    } else {
      if (component.tab() === 0) {
        if (component.validation1()) {
          component.submit()
            .subscribe(result => {
              resolve();
              setNotifyProcess();
              // this.message.success(this.translate.instant('global.accept-authorization-successfully'));
              this.model.confirm({
                nzTitle: '授权已成功，是否切换到授权公司',
                // nzContent: '<b>Some descriptions</b>',
                nzOnOk: () => {
                  this.service.switchCompany(component.cid()).subscribe(res => {
                    this.auth.onLogin({
                      token: res.token,
                      userInfo: res.auth,
                      permissions: this.ts.recursionNodesMapArray(res.permissions, p => p.code, p => p.status)
                    });
                    this.router.navigate([`/manage/transmit/type`]);
                  });
                }
              });
            }, error => {
              reject(false);
            });
        } else {
          reject(false);
        }
      }
      if (component.tab() === 1) {
        if (component.validation2()) {
          component.submit()
            .subscribe(result => {
              resolve();
              setNotifyProcess();
              // this.message.success(this.translate.instant('global.accept-authorization-successfully'));
              this.model.confirm({
                nzTitle: '授权已成功，是否切换到授权公司',
                // nzContent: '<b>Some descriptions</b>',
                nzOnOk: () => {
                  this.service.switchCompany(result.company_id).subscribe(res => {
                    this.auth.onLogin({
                      token: res.token,
                      userInfo: res.auth,
                      permissions: this.ts.recursionNodesMapArray(res.permissions, p => p.code, p => p.status)
                    });
                    this.router.navigate([`/manage/transmit/type`]);
                  });
                }
              });
            }, error => {
              reject(false);
            });
        } else {
          reject(false);
        }
      }
    }
  })


  // 母带授权接受
  // submit() {
  //   const status = true;
  //   if (this.typeId === undefined) {
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
      this.service.refusedPubAuth(status, this.related_id).subscribe(res => {
        this.message.warning(this.translate.instant('global.refused-authorization-information'));
        // this.visible = false;
      });
    }
  }
  // 宣发分享接受
  // sharedSubmit() {
  //   const status = true;
  //   if (this.shareId === undefined) {
  //     this.shareId = '';
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
    this.shareId = data;
    if (!!data) {
      this.isDisparShow = true;
    } else {
      this.isDisparShow = false;
    }
  }
  onChoseCompany(data) {
    this.typeId = data;
    if (!!data) {
      this.isChoseShow = true;
    } else {
      this.isChoseShow = false;
    }
  }
}
