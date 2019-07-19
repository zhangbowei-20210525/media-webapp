import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageComponent } from './image.component';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { ACLGuard, ACLType } from '@delon/acl';
import { aclAbility } from '@core/acl';
import { FilmsDetailsComponent } from './films-details/films-details.component';
import { DetailsSolicitationComponent } from './details-solicitation/details-solicitation.component';
import { AdminFilmsDetailsComponent } from './admin-films-details/admin-films-details.component';
import { ReceiveSolicitationComponent } from './receive-solicitation/receive-solicitation.component';
import { SampleViewComponent } from './sample-view/sample-view.component';
import { ReviewViewComponent } from './review-view/review-view.component';
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
      { path: '', redirectTo: 'sample-view', pathMatch: 'full' },
      {
        path: 'image',
        component: ImageComponent,
        canActivate: [ACLGuard],
        data: {
          guard: <ACLType>{
            ability: [aclAbility.review.edit]
          }
        }
      },
      {
        path: 'sample-view',
        component: SampleViewComponent,
      },
      {
        path: 'review-view',
        component: ReviewViewComponent,
      }
    ]
  },
  {
    path: 'receive-solicitation/:id', component: ReceiveSolicitationComponent,
  },
  {
    path: 'image-details/:id', component: ImageDetailsComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
  {
    path: 'films-details/:id', component: FilmsDetailsComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
  {
    path: 'details-solicitation/:id', component: DetailsSolicitationComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
    {
    path: 'admin-films-details/:id', component: AdminFilmsDetailsComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
  {
    path: 'admin-films-details/:id', component: AdminFilmsDetailsComponent,
    // canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.image.view] } }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageRoutingModule { }



