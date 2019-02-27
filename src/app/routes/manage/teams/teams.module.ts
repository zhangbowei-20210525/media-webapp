import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import { TeamInfoComponent } from './team-info.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { SharedModule } from '@shared';
import { AddDepartmentComponent } from './components/add-department.component';
import { AddCompanyComponent } from './components/add-company.component';
import { AddEmployeeComponent } from './employees/add-employee.component';
import { EmployeesComponent } from './employees/employees.component';
import { RolesComponent } from './roles/roles.component';
import { EmployeeDepartmentComponent } from './employee-details/components/employee-department.component';
import { EditCompanyComponent } from './components/edit-company.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

@NgModule({
  declarations: [
    TeamsComponent,
    TeamInfoComponent,
    AddDepartmentComponent,
    AddCompanyComponent,
    AddEmployeeComponent,
    EmployeesComponent,
    EmployeeDetailsComponent,
    RolesComponent,
    EmployeeDepartmentComponent,
    EditCompanyComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddDepartmentComponent,
    AddCompanyComponent,
    AddEmployeeComponent,
    EmployeeDepartmentComponent,
  ]
})
export class TeamsModule { }
