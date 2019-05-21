import { Component, OnInit } from '@angular/core';
import { PaginationDto } from '@shared';
import { Router } from '@angular/router';
import { CustomersService } from './customers.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { ACLAbility } from '@core/acl';
import { ACLService } from '@delon/acl';

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
    public ability: ACLAbility,
    private router: Router,
    private service: CustomersService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
    private acl: ACLService
  ) {
    console.log('can', ability.custom.view, acl.canAbility({ ability: [ability.custom.view] }));
  }

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
    this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: tapeId, source_type: source_type }]);
  }

  addCustomer() {
    this.modal.create({
      nzTitle: `新增客商`,
      nzContent: AddCustomerComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addCustomerAgreed,
      nzNoAnimation: true
    });
  }

  addCustomerAgreed = (component: AddCustomerComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('global.add-success'));
          this.fetchPublicities();
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  deleteCustomer(data: any) {
    this.modal.confirm({
      nzTitle: data.related ? '该客商存在关联数据，此操作将会删除所有关联数据，是否删除该客商信息？' : '是否删除该客商信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteCustomerAgreed(data.id)
    });
  }

  deleteCustomerAgreed = (id: number) => new Promise((resolve, reject) => {
    this.service.deleteCustomers(id).subscribe(result => {
      this.fetchPublicities();
      this.message.success(this.translate.instant('global.delete-success'));
      resolve();
    }, error => {
      reject(false);
    });
  })

}
