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

@NgModule({
  declarations: [
    CustomersComponent,
    CustomerDetailsComponent,
    AddCustomerComponent,
    AddLogComponent,
    EditCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    SharedModule
  ],
  entryComponents: [
    AddCustomerComponent,
    AddLogComponent,
    EditCustomerComponent
  ]
})
export class CustomersModule { }