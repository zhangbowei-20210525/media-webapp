import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutsideComponent } from './outside.component';
import { CollectionReceiveComponent } from './collection-receive/collection-receive.component';
import { OutsideRoutingModule } from './outside-routing.module';
import { AcceptEmployeeInvitationsComponent } from './accept-employee-invitations/accept-employee-invitations.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { InternetCompanyInvitationComponent } from './internet-company-invitation/internet-company-invitation.component';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [
    OutsideComponent,
    CollectionReceiveComponent,
    AcceptEmployeeInvitationsComponent,
    InternetCompanyInvitationComponent
  ],
  imports: [
    CommonModule,
    OutsideRoutingModule,
    NgZorroAntdModule,
    SharedModule
  ]
})
export class OutsideModule { }
