import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpManagementRoutingModule } from './ip-management-routing.module';
import { IpManagementComponent } from './ip-management.component';
import { SharedModule } from '@shared';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddIpComponent } from './add-ip/add-ip.component';
import { IpDetailsComponent } from './ip-details/ip-details.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';

@NgModule({
  declarations: [
    IpManagementComponent,
    AddIpComponent,
    IpDetailsComponent,
    ContractDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    IpManagementRoutingModule
  ],
  entryComponents: [
  ]
})
export class IpManagementModule { }
