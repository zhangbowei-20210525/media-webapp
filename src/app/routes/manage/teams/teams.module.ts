import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { SharedModule } from '@shared';
import { AddDepartmentComponent } from './components/add-department.component';
import { AddCompanyComponent } from './components/add-company.component';
import { AddEmployeeComponent } from './employees/add-employee.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

@NgModule({
  declarations: [TeamsComponent, AddDepartmentComponent, AddCompanyComponent, AddEmployeeComponent, EmployeesComponent, EmployeeDetailsComponent],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddDepartmentComponent,
    AddCompanyComponent,
    AddEmployeeComponent
  ]
})
export class TeamsModule { }
