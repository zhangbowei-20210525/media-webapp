import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageComponent } from './image.component';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { ACLGuard, ACLType } from '@delon/acl';
import { aclAbility } from '@core/acl';
import { VerifyFilmsComponent } from './verify-films/verify-films.component';
import { FilmsDetailsComponent } from './films-details/films-details.component';
import { DetailsSolicitationComponent } from './details-solicitation/details-solicitation.component';

const routes: Routes = [
  {
    path: '',
    component: ImageComponent,
    canActivate: [ACLGuard],
    canActivateChild: [ACLGuard],
    data: {
      guard: <ACLType>{
        ability: [aclAbility.program.view]
      }
    },
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      {
        path: 'image',
        component: ImageComponent,
        canActivate: [ACLGuard],
        data: {
          guard: <ACLType>{
            ability: [aclAbility.program.image.view]
          }
        }
      },
    ]
  },
  {
    path: 'image-details/:id', component: ImageDetailsComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
  {
    path: 'verify-films', component: VerifyFilmsComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
  {
    path: 'films-details', component: FilmsDetailsComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
  {
    path: 'details-solicitation', component: DetailsSolicitationComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageRoutingModule { }



