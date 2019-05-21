import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { ACLGuard, ACLType } from '@delon/acl';
import { aclAbility } from '@core/acl';

const routes: Routes = [
  {
    path: '', component: CustomersComponent,
    canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.custom.view] } }
  },
  {
    path: 'd/:id', component: CustomerDetailsComponent,
    canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.custom.view] } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
