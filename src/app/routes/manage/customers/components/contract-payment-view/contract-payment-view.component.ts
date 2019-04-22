import { Component, OnInit, Input } from '@angular/core';
import { CustomersService } from '../../customers.service';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { Util } from '@shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contract-payment-view',
  templateUrl: './contract-payment-view.component.html',
  styleUrls: ['./contract-payment-view.component.less']
})
export class ContractPaymentViewComponent implements OnInit {

  @Input() id: number;
  @Input() mode: 'inflow' | 'outflow';
  isLoading = false;
  orders: any[] = [];
  payments: any[] = [];

  get stateText() {
    return this.mode === 'inflow' ? '收款' : '付款';
  }

  constructor(
    private service: CustomersService,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.service.getContractPayments(this.id).pipe(finalize(() => this.isLoading = false)).subscribe(result => {
      this.orders = result.order_list;
      this.payments = result.payment_list;
    });
  }

  addRow() {
    this.payments = [...this.payments, { edit: true }];
  }

  delete(data: any) {
    this.service.deleteContractPayment(data.id).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.payments = this.payments.filter(p => p !== data);
    });
  }

  save(data: any) {
    if (!(+data.pay_amount > 0)) {
      this.message.warning('请输入正确的金额');
      return;
    }
    if (!data.pay_date) {
      this.message.warning('请选择日期');
      return;
    }
    const date = Util.dateToString(data.pay_date);
    this.service.addContractPayment(this.id, +data.pay_amount, date, data.pay_remark).subscribe(result => {
      this.message.success(this.translate.instant('global.save-successfully'));
      data.edit = false;
      data.pay_date = date;
      data.id = result.id;
    });
  }

  cancelConfirm(data: any) {
    this.payments = this.payments.filter(p => p !== data);
  }

}
