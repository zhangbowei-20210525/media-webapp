import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpManagementRoutingModule } from './ip-management-routing.module';
import { IpManagementComponent } from './ip-management.component';
import { SharedModule } from '@shared';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddIpComponent } from './add-ip/add-ip.component';

@NgModule({
  declarations: [
    IpManagementComponent,
    AddIpComponent
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
