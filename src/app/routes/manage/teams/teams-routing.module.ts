import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { TeamsComponent } from './teams.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { RolesComponent } from './roles/roles.component';
import { TeamInfoComponent } from './team-info.component';
import { InterconnectionEnterprisesComponent } from './interconnection-enterprises/interconnection-enterprises.component';
import { DepartmentManagementComponent } from './department-management/department-management.component';

const routes: Routes = [
  {
    path: '',
    component: TeamsComponent,
    children: [
      {
        path: '',
        component: DepartmentManagementComponent,
        redirectTo: 'department-management'
      },
      {
        path: 'department-management',
        component: DepartmentManagementComponent,
        children: [
          {
            path: '',
            component: TeamInfoComponent
          },
          {
            path: 'employees/:id',
            component: EmployeesComponent
          },
          {
            path: 'employee-details/:id',
            component: EmployeeDetailsComponent
          },
          {
            path: 'roles',
            component: RolesComponent
          }
        ]
      },
      {
        path: 'interconnection-enterprises',
        component: InterconnectionEnterprisesComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule { }
