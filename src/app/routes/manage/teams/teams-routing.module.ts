import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { TeamsComponent } from './teams.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

const routes: Routes = [
  {
    path: '',
    component: TeamsComponent,
    children: [{
      path: '',
      redirectTo: 'employees/null',
      pathMatch: 'full'
    },
    {
      path: 'employees/:id',
      component: EmployeesComponent
    },
    {
      path: 'employee-details/:id',
      component: EmployeeDetailsComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule { }
