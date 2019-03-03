import { finalize, delay } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NotifyService } from './notify.service';
import { PaginationDto } from '@shared';

@Component({
  selector: 'app-nav-notify',
  templateUrl: './nav-notify.component.html',
  styleUrls: ['./nav-notify.component.less']
})
export class NavNotifyComponent implements OnInit {

  sysPagination = { page: 1, page_size: 10 } as PaginationDto;
  srcPagination = { page: 1, page_size: 10 } as PaginationDto;
  outPagination = { page: 1, page_size: 10 } as PaginationDto;

  isSysLoaded = false;
  isSrcLoaded = false;
  isOutLoaded = false;

  isSysLoding = false;
  isSrcLoding = false;
  isOutLoding = false;

  sysNotifys = [];
  srcNotifys = [];
  outNotifys = [];

  constructor(
    private service: NotifyService
  ) { }

  ngOnInit() {
    this.loadSysNotifys();
  }

  loadSysNotifys() {
    this.isSysLoding = true;
    this.service.getSystemNotify(this.sysPagination)
      .pipe(delay(1000), finalize(() => {
        this.isSysLoding = false;
        this.isSysLoaded = true;
      }))
      .subscribe(result => {
        this.sysNotifys = result.list;
        // this.sysNotifys = [...result.list, ...result.list, ...result.list, ...result.list];
        this.sysPagination.count = result.pagination.count;
        this.sysPagination.pages = result.pagination.pages;
      });
  }

  loadSrcNotifys() {
    this.isSrcLoding = true;
    this.service.getSourceNotify(this.srcPagination)
      .pipe(finalize(() => {
        this.isSrcLoding = false;
        this.isSrcLoaded = true;
      }))
      .subscribe(result => {
        this.srcNotifys = result.list;
        this.srcPagination.count = result.pagination.count;
      });
  }

  loadOutNotifys() {
    this.isSysLoding = true;
    this.service.getOutsideNotify(this.outPagination)
      .pipe(finalize(() => {
        this.isOutLoding = false;
        this.isOutLoaded = true;
      }))
      .subscribe(result => {
        this.outNotifys = result.list;
        this.outPagination.count = result.pagination.count;
      });
  }

  fetchSysNotifys() {
    this.isSysLoding = true;
    this.service.getSystemNotify(this.sysPagination)
      .pipe(finalize(() => this.isSysLoding = false))
      .subscribe(result => {
        this.sysNotifys = [...this.sysNotifys, ...result.list];
        this.sysPagination.count = result.pagination.count;
        this.sysPagination.pages = result.pagination.pages;
      });
  }

  fetchSrcNotifys() {
    this.isSrcLoding = true;
    this.service.getSourceNotify(this.srcPagination)
      .pipe(finalize(() => this.isSrcLoding = false))
      .subscribe(result => {
        this.srcNotifys = [...this.srcNotifys, ...result.list];
        this.srcPagination.count = result.pagination.count;
      });
  }

  fetchOutNotifys() {
    this.isSysLoding = true;
    this.service.getOutsideNotify(this.outPagination)
      .pipe(finalize(() => this.isOutLoding = false))
      .subscribe(result => {
        this.outNotifys = [...this.outNotifys, ...result.list];
        this.outPagination.count = result.pagination.count;
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
    if (event.index == 1) {
      if (!this.isSrcLoaded) {
        this.loadSrcNotifys();
      }
    } else if (event.index == 2) {
      if (!this.isOutLoaded) {
        this.loadOutNotifys();
      }
    }
  }

}
