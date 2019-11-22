import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IpManagementComponent } from './ip-management.component';
import { AddIpComponent } from './add-ip/add-ip.component';
import { IpDetailsComponent } from './ip-details/ip-details.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { ACLGuard, ACLType } from '@delon/acl';
import { aclAbility } from '@core/acl';



const routes: Routes = [
  {
    path: '',
    component: IpManagementComponent,
  },
  {
    path: 'add-ip',
    component: AddIpComponent,
    canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.ip.edit] } }
  },
  {
    path: 'd/:id',
    component: IpDetailsComponent,
  },
  {
    path: 'cd/:id',
    component: ContractDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IpManagementRoutingModule { }
