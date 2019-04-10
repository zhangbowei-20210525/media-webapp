import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { CustomersService } from '../customers.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { PaginationDto } from '@shared';
import { AddLogComponent } from '../components/add-log/add-log.component';
import { EditCustomerComponent } from '../components/edit-customer/edit-customer.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.less']
})
export class CustomerDetailsComponent implements OnInit {

  customerInfo: any;
  rightsPagination = { page: 1, page_size: 999 } as PaginationDto;
  contractsPagination = { page: 1, page_size: 999 } as PaginationDto;
  logsPagination = { page: 1, page_size: 10 } as PaginationDto;
  id: number;
  rightList = [];
  contractList = [];
  logList = [];
  switchValue = false;
  liaisonTabs = [];
  rightDataSet = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CustomersService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('id');
        this.logsPagination.page = +params.get('page') || 1;
        return this.service.getCustomerDetailsInfo(this.id);
      })
    ).subscribe(res => {
      this.customerInfo = res;
      // this.service.getRights(this.rightsPagination, this.id).subscribe(r => {
      //   this.rightList = r.list;
      // });
      this.fetchRights();
      this.service.getContracts(this.contractsPagination, this.id).subscribe(c => {
        this.contractList = c.list;
      });
      // this.service.getLogs(this.logsPagination, this.id).subscribe(l => {
      //   this.logList = l.list;
      //   this.logsPagination = l.pagination;
      // });
      this.service.getLiaisons(this.id).subscribe(result => {
        this.liaisonTabs = result.list;
      });
    });
  }

  fetchRights() {
    this.service.getRights(this.rightsPagination, this.id).subscribe(result => {
      this.rightDataSet = this.service.mapCopyrights(result.list);
      this.rightsPagination = result.pagination;
    });
  }

  copyrightsPageChange(page: number) {
    this.rightsPagination.page = page;
    this.fetchRights();
  }

  editCustomer() {
    this.modal.create({
      nzTitle: `修改客商信息`,
      nzContent: EditCustomerComponent,
      nzComponentParams: { id: this.id },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOkText: '保存',
      nzOnOk: this.editCustomerAgreed
    });
  }

  editCustomerAgreed = (component: EditCustomerComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.service.getCustomerDetailsInfo(this.id).subscribe(result => {
          this.customerInfo = result;
        });
        this.message.success(this.translate.instant('global.edit-success'));
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  logsPageChange() {
    const page = this.logsPagination.page;
    if (page < 1 || page > this.logsPagination.pages) {
      return;
    }
    this.router.navigate([`/manage/customers/d/${this.id}`, { page: page }]);
  }

  addLog() {
    this.modal.create({
      nzTitle: `新增日志`,
      nzContent: AddLogComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: { id: this.id },
      nzWidth: 500,
      nzOkText: '提交',
      nzOnOk: this.addLogAgreed
    });
  }

  addLogAgreed = (component: AddLogComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.service.getLogs(this.logsPagination, this.id).subscribe(l => {
          this.logList = l.list;
          this.logsPagination = l.pagination;
        });
        this.message.success(this.translate.instant('global.add-success'));
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  logContent(content: string) {
    this.modal.create({
      nzTitle: '日志内容',
      nzContent: `<p>${content}</p>`,
      nzOkText: null,
      nzCancelText: null,
      nzClosable: false,
    });
  }

  deleteLog(id: number) {
    this.modal.confirm({
      nzTitle: '是否删除本条日志信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteLogAgreed(id)
    });
  }

  deleteLogAgreed = (id: number) => new Promise((resolve) => {
    this.service.deleteLog(this.id, id).subscribe(res => {
      this.service.getLogs(this.logsPagination, this.id).subscribe(l => {
        this.logList = l.list;
        this.logsPagination = l.pagination;
      });
      this.message.success(this.translate.instant('global.delete-success'));
      resolve();
    }, error => {
      if (error.message) {
        this.message.error(error.message);
      }
      resolve(false);
    });
  })
}
