import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IpManagementComponent } from './ip-management.component';
import { AddIpComponent } from './add-ip/add-ip.component';
import { IpDetailsComponent } from './ip-details/ip-details.component';



const routes: Routes = [
  {
    path: '',
    component: IpManagementComponent,
  },
  {
    path: 'add-ip',
    component: AddIpComponent,
  },
  // {
  //   path: 'ip',
  //   component: IpManagementComponent,
  // },
  {
    path: 'd/:id',
    component: IpDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IpManagementRoutingModule { }
