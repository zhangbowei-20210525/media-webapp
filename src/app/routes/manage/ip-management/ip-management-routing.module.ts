import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IpManagementComponent } from './ip-management.component';
import { AddIpComponent } from './add-ip/add-ip.component';



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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IpManagementRoutingModule { }
