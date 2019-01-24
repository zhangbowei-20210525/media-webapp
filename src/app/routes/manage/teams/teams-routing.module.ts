import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { TeamsComponent } from './teams.component';
import { EmployeesComponent } from './employees/employees.component';

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
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamsRoutingModule { }
