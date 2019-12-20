import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutsideComponent } from './outside.component';
import { CollectionReceiveComponent } from './collection-receive/collection-receive.component';
import { AcceptEmployeeInvitationsComponent } from './accept-employee-invitations/accept-employee-invitations.component';
import { InternetCompanyInvitationComponent } from './internet-company-invitation/internet-company-invitation.component';

const routes: Routes = [
  {
    path: '',
    component: OutsideComponent,
    children: [
      { path: 'collection-receive/:id', component: CollectionReceiveComponent },
      { path: 'accept-employee-invitations/:id', component: AcceptEmployeeInvitationsComponent },
      { path: 'ici/:id', component: InternetCompanyInvitationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutsideRoutingModule { }
