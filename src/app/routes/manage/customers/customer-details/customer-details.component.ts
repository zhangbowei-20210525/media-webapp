import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { CustomersService } from '../customers.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, finalize } from 'rxjs/operators';
import { PaginationDto } from '@shared';
import { AddLogComponent } from '../components/add-log/add-log.component';
import { EditCustomerComponent } from '../components/edit-customer/edit-customer.component';
import { ContractPaymentViewComponent } from '../components/contract-payment-view/contract-payment-view.component';
import { zip } from 'rxjs';
import { AddLiaisonsComponent } from '../components/add-liaisons/add-liaisons.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.less']
})
export class CustomerDetailsComponent implements OnInit {

  id: number;
  customer: any;
  purchasePagination = { page: 1, page_size: 10 } as PaginationDto;
  publishPagination = { page: 1, page_size: 10 } as PaginationDto;
  purchaseContractsPagination = { page: 1, page_size: 10 } as PaginationDto;
  publishContractsPagination = { page: 1, page_size: 10 } as PaginationDto;
  purchaseRightsLoading = false;
  publishRightsLoading = false;
  purchaseContractsLoading = false;
  publishContractsLoading = false;
  // logsPagination = { page: 1, page_size: 10 } as PaginationDto;
  // logList = [];
  // switchValue = false;
  liaisonTabs = [];
  purchaseDataSet = [];
  publishDataSet = [];
  purchaseContractDataSet = [];
  publishContractDataSet = [];
  isInfoLoaded = false;
  isLiaisonsLoaded = false;
  rightsTabIndex = 0;
  contractsTabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CustomersService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      // this.logsPagination.page = +params.get('page') || 1;
      this.fetchCustomerDetailsInfo();
      this.fetchRights();
      this.fetchContracts();
      this.fetchLiaisons();
      // this.service.getLogs(this.logsPagination, this.id).subscribe(l => {
      //   this.logList = l.list;
      //   this.logsPagination = l.pagination;
      // });
    });
  }

  fetchRights() {
    this.purchaseRightsLoading = this.publishRightsLoading = true;
    zip(
      this.service.getRights(this.purchasePagination, this.id, 'purchase'),
      this.service.getRights(this.publishPagination, this.id, 'publish'))
      .pipe(finalize(() => this.purchaseRightsLoading = this.publishRightsLoading = false))
      .subscribe(results => {
        const data = {
          purchase: results[0],
          publish: results[1]
        };
        this.purchaseDataSet = this.service.mapCopyrights(data.purchase.list);
        this.purchasePagination = data.purchase.pagination;
        this.publishDataSet = this.service.mapCopyrights(data.publish.list);
        this.publishPagination = data.publish.pagination;
        if (data.publish.pagination.count > data.purchase.pagination.count) {
          this.rightsTabIndex = 1;
        }
      });
  }

  fetchContracts() {
    this.purchaseContractsLoading = this.publishContractsLoading = true;
    zip(
      this.service.getContracts(this.purchaseContractsPagination, this.id, 'purchase'),
      this.service.getContracts(this.publishContractsPagination, this.id, 'publish'))
      .pipe(finalize(() => this.purchaseContractsLoading = this.publishContractsLoading = false))
      .subscribe(results => {
        const data = {
          purchase: results[0],
          publish: results[1]
        };
        this.purchaseContractDataSet = data.purchase.list;
        this.purchaseContractsPagination = data.purchase.pagination;
        this.publishContractDataSet = data.publish.list;
        this.publishContractsPagination = data.publish.pagination;
        if (data.publish.pagination.count > data.purchase.pagination.count) {
          this.contractsTabIndex = 1;
        }
      });
  }

  fetchCustomerDetailsInfo() {
    this.service.getCustomerDetailsInfo(this.id).pipe(finalize(() => this.isInfoLoaded = true)).subscribe(result => {
      this.customer = result;
    });
  }

  fetchPurchaseRights() {
    this.purchaseRightsLoading = true;
    this.service.getRights(this.purchasePagination, this.id, 'purchase')
      .pipe(finalize(() => this.purchaseRightsLoading = false))
      .subscribe(result => {
        this.purchaseDataSet = this.service.mapCopyrights(result.list);
        this.purchasePagination = result.pagination;
      });
  }

  fetchPublishRights() {
    this.publishRightsLoading = true;
    this.service.getRights(this.publishPagination, this.id, 'publish')
      .pipe(finalize(() => this.publishRightsLoading = false))
      .subscribe(result => {
        this.publishDataSet = this.service.mapCopyrights(result.list);
        this.publishPagination = result.pagination;
      });
  }

  fetchPurchaseContracts() {
    this.purchaseContractsLoading = true;
    this.service.getContracts(this.purchaseContractsPagination, this.id, 'purchase')
      .pipe(finalize(() => this.purchaseContractsLoading = false))
      .subscribe(result => {
        this.purchaseContractDataSet = result.list;
        this.purchaseContractsPagination = result.pagination;
      });
  }

  fetchPublishContracts() {
    this.publishContractsLoading = true;
    this.service.getContracts(this.publishContractsPagination, this.id, 'publish')
      .pipe(finalize(() => this.publishContractsLoading = false))
      .subscribe(result => {
        this.publishContractDataSet = result.list;
        this.publishContractsPagination = result.pagination;
      });
  }

  fetchLiaisons() {
    this.service.getLiaisons(this.id).pipe(finalize(() => this.isLiaisonsLoaded = true)).subscribe(result => {
      this.liaisonTabs = result.list;
    });
  }

  purchasePageChange(page: number) {
    this.purchasePagination.page = page;
    this.fetchPurchaseRights();
  }

  publishPageChange(page: number) {
    this.publishPagination.page = page;
    this.fetchPublishRights();
  }

  purchaseContractsPageChange(page: number) {
    this.purchaseContractsPagination.page = page;
    this.fetchPurchaseContracts();
  }

  publishContractsPageChange(page: number) {
    this.publishContractsPagination.page = page;
    this.fetchPublishContracts();
  }

  goBack() {
    window.history.back();
  }

  showPayment(id: number, mode: 'inflow' | 'outflow') {
    this.modal.create({
      nzTitle: (mode === 'inflow' ? '??????' : '??????') + '??????',
      nzContent: ContractPaymentViewComponent,
      nzComponentParams: { id, mode },
      nzFooter: null,
      nzWidth: 800,
    });
  }

  addLiaisons() {
    this.modal.create({
      nzTitle: '???????????????',
      nzContent: AddLiaisonsComponent,
      nzComponentParams: { id: this.id },
      nzWidth: 800,
      nzOnOk: this.addLiaisonsAgreed
    });
  }

  addLiaisonsAgreed = (component: AddLiaisonsComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit().subscribe(result => {
        this.message.success(this.translate.instant('global.add-success'));
        this.fetchLiaisons();
        resolve();
      }, error => {
        reject(false);
      });
    } else {
      reject(false);
    }
  })

  // editCustomer() {
  //   this.modal.create({
  //     nzTitle: `??????????????????`,
  //     nzContent: EditCustomerComponent,
  //     nzComponentParams: { id: this.id },
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: 800,
  //     nzOkText: '??????',
  //     nzOnOk: this.editCustomerAgreed
  //   });
  // }

  // editCustomerAgreed = (component: EditCustomerComponent) => new Promise((resolve) => {
  //   component.formSubmit()
  //     .subscribe(res => {
  //       this.service.getCustomerDetailsInfo(this.id).subscribe(result => {
  //         this.customerInfo = result;
  //       });
  //       this.message.success(this.translate.instant('global.edit-success'));
  //       resolve();
  //     }, error => {
  //       if (error.message) {
  //         this.message.error(error.message);
  //       }
  //     });
  // })

  // logsPageChange() {
  //   const page = this.logsPagination.page;
  //   if (page < 1 || page > this.logsPagination.pages) {
  //     return;
  //   }
  //   this.router.navigate([`/manage/customers/d/${this.id}`, { page: page }]);
  // }

  // addLog() {
  //   this.modal.create({
  //     nzTitle: `????????????`,
  //     nzContent: AddLogComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzComponentParams: { id: this.id },
  //     nzWidth: 500,
  //     nzOkText: '??????',
  //     nzOnOk: this.addLogAgreed
  //   });
  // }

  // addLogAgreed = (component: AddLogComponent) => new Promise((resolve) => {
  //   component.formSubmit()
  //     .subscribe(res => {
  //       this.service.getLogs(this.logsPagination, this.id).subscribe(l => {
  //         this.logList = l.list;
  //         this.logsPagination = l.pagination;
  //       });
  //       this.message.success(this.translate.instant('global.add-success'));
  //       resolve();
  //     }, error => {
  //       if (error.message) {
  //         this.message.error(error.message);
  //       }
  //     });
  // })

  // logContent(content: string) {
  //   this.modal.create({
  //     nzTitle: '????????????',
  //     nzContent: `<p>${content}</p>`,
  //     nzOkText: null,
  //     nzCancelText: null,
  //     nzClosable: false,
  //   });
  // }

  // deleteLog(id: number) {
  //   this.modal.confirm({
  //     nzTitle: '???????????????????????????????',
  //     nzOkText: '??????',
  //     nzCancelText: '??????',
  //     nzOkType: 'danger',
  //     nzOnOk: () => this.deleteLogAgreed(id)
  //   });
  // }

  // deleteLogAgreed = (id: number) => new Promise((resolve) => {
  //   this.service.deleteLog(this.id, id).subscribe(res => {
  //     this.service.getLogs(this.logsPagination, this.id).subscribe(l => {
  //       this.logList = l.list;
  //       this.logsPagination = l.pagination;
  //     });
  //     this.message.success(this.translate.instant('global.delete-success'));
  //     resolve();
  //   }, error => {
  //     if (error.message) {
  //       this.message.error(error.message);
  //     }
  //     resolve(false);
  //   });
  // })
}
