import { Component, OnInit } from '@angular/core';
import { PaginationDto } from '@shared';
import { Router } from '@angular/router';
import { CustomersService } from './customers.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.less']
})
export class CustomersComponent implements OnInit {

  isLoaded = false;
  isLoading = false;
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  dataset = [];

  constructor(
    private router: Router,
    private service: CustomersService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.fetchPublicities();
  }

  fetchPublicities() {
    this.isLoading = true;
    this.service.getCustomers(this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        if (!this.isLoaded) {
          this.isLoaded = true;
        }
      }))
      .subscribe(result => {
        this.dataset = result.list;
        this.pagination = result.pagination;
      });
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.fetchPublicities();
  }

  tapeDetails(program_id: number, tapeId: number, source_type: string) {
    this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: tapeId, source_type: source_type}]);
  }

  addCustomer() {
    this.modal.create({
      nzTitle: `新增客商`,
      nzContent: AddCustomerComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addCustomerAgreed
    });
  }

  addCustomerAgreed = (component: AddCustomerComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
        this.fetchPublicities();
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  deleteCustomers(id: number) {
    this.modal.confirm({
      nzTitle: '是否删除本条客商信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteCustomersAgreed(id)
    });
  }

  deleteCustomersAgreed = (id: number) => new Promise((resolve) => {
    this.service.deleteCustomers(id).subscribe(res => {
      this.fetchPublicities();
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
