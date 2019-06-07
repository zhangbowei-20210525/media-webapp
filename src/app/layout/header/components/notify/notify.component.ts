import { finalize, delay } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotifyService } from './notify.service';
import { PaginationDto, MessageService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { NotifiesPolling } from '@core/notifies';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.less']
})
export class NotifyComponent implements OnInit {

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

  constructor(
    private service: NotifyService,
    private message: MessageService,
    private translate: TranslateService,
    private np: NotifiesPolling
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

  messageDetails(title: string, created_at: string, content: string, id: number, type: string) {
    this.visible = true;
    this.drawerTitle = title;
    this.drawerCreated_at = created_at;
    this.drawerContent = content;
    this.related_id = id;
    this.type = type;
    if (type === 'SOU005') {
      this.service.getAuthorizationInfo(this.related_id).subscribe(res => {
        this.authInfo = res;
        this.companyId = res.auth_company_id;
        if (this.companyId === null) {
          this.isShowRadio = true;
          this.isShowInput = false;
          this.service.getCompanyList().subscribe(cl => {
            this.companyList = cl;
            this.companyList = this.companyList.filter(f => f.id_default_company === false);
          });
        } else {
          this.isShowInput = true;
          this.isShowRadio = false;
          this.acceptCompany = res.auth_company_full_name;
        }
      });
    }
  }

  submit() {
    if (this.companyId === null) {
      if (this.acceptCompanyId === undefined) {
        this.message.warning(this.translate.instant('global.please-select-receivr-company'));
      } else {
        const data = {
          status: true,
          company_id: this.acceptCompanyId
        };
        this.service.pubAuth(this.related_id, data).subscribe(res => {
          this.message.success(this.translate.instant('global.accept-authorization-successfully'));
          this.visible = false;
        });
      }
    } else {
      const data = {
        status: true,
        company_id: this.companyId
      };
      this.service.pubAuth(this.related_id, data).subscribe(res => {
        this.message.success(this.translate.instant('global.accept-authorization-successfully'));
        this.visible = false;
      });
    }
  }

  refused() {
    const data = {
      status: false,
      company_id: null,
    };
    this.service.pubAuth(this.related_id, data).subscribe(res => {
      this.message.warning(this.translate.instant('global.refused-authorization-information'));
      this.visible = false;
    });
  }

}
