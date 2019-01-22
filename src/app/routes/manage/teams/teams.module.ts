import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { SharedModule } from '@shared';
import { AddDepartmentComponent } from './components/add-department.component';

@NgModule({
  declarations: [TeamsComponent, AddDepartmentComponent],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddDepartmentComponent
  ]
})
export class TeamsModule { }
