import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { SharedModule } from '@shared';
import { AddDepartmentComponent } from './components/add-department.component';
import { AddCompanyComponent } from './components/add-company.component';

@NgModule({
  declarations: [TeamsComponent, AddDepartmentComponent, AddCompanyComponent],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddDepartmentComponent,
    AddCompanyComponent
  ]
})
export class TeamsModule { }
