import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import { TeamInfoComponent } from './team-info.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { SharedModule } from '@shared';
import { AddDepartmentComponent } from './components/add-department.component';
import { AddCompanyComponent } from './components/add-company.component';
import { EmployeesComponent } from './employees/employees.component';
import { RolesComponent } from './roles/roles.component';
import { EmployeeDepartmentComponent } from './employee-details/components/employee-department.component';
import { EditCompanyComponent } from './components/edit-company.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EditEmployeeComponent } from './components/edit-employee.component';
import { EnterpriseCertificationComponent } from './components/enterprise-certification/enterprise-certification.component';
import { ImportStaffComponent } from './components/import-staff/import-staff.component';
import { UnapprovedInvitationInfoComponent } from './unapproved-invitation-info/unapproved-invitation-info.component';
import { DepartmentManagementComponent } from './department-management/department-management.component';
import { InterconnectionEnterprisesComponent } from './interconnection-enterprises/interconnection-enterprises.component';

@NgModule({
  declarations: [
    TeamsComponent,
    TeamInfoComponent,
    AddDepartmentComponent,
    AddCompanyComponent,
    EmployeesComponent,
    EmployeeDetailsComponent,
    RolesComponent,
    EmployeeDepartmentComponent,
    EditCompanyComponent,
    EditEmployeeComponent,
    EnterpriseCertificationComponent,
    ImportStaffComponent,
    UnapprovedInvitationInfoComponent,
    DepartmentManagementComponent,
    InterconnectionEnterprisesComponent,
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    SharedModule,
  ],
  entryComponents: [
    AddDepartmentComponent,
    AddCompanyComponent,
    EmployeeDepartmentComponent,
    EditCompanyComponent,
    EditEmployeeComponent,
    EnterpriseCertificationComponent,
    ImportStaffComponent,
  ]
})
export class TeamsModule { }
