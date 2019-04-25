import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { AddLogComponent } from './components/add-log/add-log.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { DelonFormModule } from '@delon/form';
import { ContractRightsViewComponent } from './components/contract-rights-view/contract-rights-view.component';
import { ContractPaymentViewComponent } from './components/contract-payment-view/contract-payment-view.component';
import { AddLiaisonsComponent } from './components/add-liaisons/add-liaisons.component';

@NgModule({
  declarations: [
    CustomersComponent,
    CustomerDetailsComponent,
    AddCustomerComponent,
    AddLogComponent,
    EditCustomerComponent,
    ContractRightsViewComponent,
    ContractPaymentViewComponent,
    AddLiaisonsComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    FormsModule,
    SharedModule,
    DelonFormModule.forRoot()
  ],
  entryComponents: [
    AddCustomerComponent,
    AddLogComponent,
    EditCustomerComponent,
    ContractPaymentViewComponent,
    AddLiaisonsComponent
  ]
})
export class CustomersModule { }
