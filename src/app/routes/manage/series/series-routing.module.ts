import { CopyrightsComponent } from './copyrights/copyrights.component';
import { PublicitiesComponent } from './publicities/publicities.component';
import { AllSeriesComponent } from './all-series/all-series.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './details/details.component';
import { AddCopyrightsComponent } from './copyrights/add-copyrights/add-copyrights.component';
import { RightComponent } from './details/right/right.component';
import { PublishRightsComponent } from './copyrights/publish-rights/publish-rights.component';
import { PublicityDetailsComponent } from './publicities/publicity-details/publicity-details.component';
import { TapesComponent } from './tapes/tapes.component';
import { PublicityComponent } from './details/publicity/publicity.component';
import { TapeComponent } from './details/tape/tape.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ProcurementComponent } from './contracts/procurement/procurement.component';
import { PublishedComponent } from './contracts/published/published.component';
import { PublishedComponent as PublishedListComponent } from './copyrights/published/published.component';
import { AllRightsComponent } from './copyrights/all-rights/all-rights.component';
import { ContractDetailsComponent } from './contracts/contract-details/contract-details.component';
import { ACLGuard, ACLType } from '@delon/acl';
import { aclAbility } from '@core/acl';


const routes: Routes = [
  {
    path: '',
    component: SeriesComponent,
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
        path: 'all',
        component: AllSeriesComponent
      },
      {
        path: 'publicity',
        component: PublicitiesComponent,
        canActivate: [ACLGuard],
        data: {
          guard: <ACLType>{
            ability: [aclAbility.program.publicity.view]
          }
        }
      },
      {
        path: 'tapes',
        component: TapesComponent,
        canActivate: [ACLGuard],
        data: {
          guard: <ACLType>{
            ability: [aclAbility.program.source.view]
          }
        }
      },
      {
        path: 'rights',
        component: CopyrightsComponent,
        canActivate: [ACLGuard],
        canActivateChild: [ACLGuard],
        data: {
          guard: <ACLType>{
            ability: [aclAbility.program.right.view]
          }
        },
        children: [
          { path: '', redirectTo: 'all', pathMatch: 'full' },
          {
            path: 'all',
            component: AllRightsComponent
          },
          {
            path: 'published',
            component: PublishedListComponent
          },
        ]
      },
      {
        path: 'contracts',
        component: ContractsComponent,
        canActivate: [ACLGuard],
        canActivateChild: [ACLGuard],
        data: {
          guard: <ACLType>{
            ability: [aclAbility.program.right.view]
          }
        },
        children: [
          { path: '', redirectTo: 'procurement', pathMatch: 'full' },
          { path: 'procurement', component: ProcurementComponent },
          { path: 'published', component: PublishedComponent }
        ]
      },
    ]
  },
  {
    path: 'publicity-details/:id', component: PublicityDetailsComponent,
    canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.publicity.view] } }
  },

  {
    path: 'cd/:id', component: ContractDetailsComponent,
    canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.right.view] } }
  },
  {
    path: 'd/:sid',
    component: SeriesDetailsComponent,
    children: [
      {
        path: 'publicityd', component: PublicityComponent,
        canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.publicity.view] } }
      },
      {
        path: 'right', component: RightComponent,
        canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.right.view] } }
      },
      {
        path: 'tape', component: TapeComponent,
        canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.source.view] } }
      }
    ]
  },
  {
    path: 'add-copyrights', component: AddCopyrightsComponent,
    canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.right.edit] } }
  },
  {
    path: 'publish-rights', component: PublishRightsComponent,
    canActivate: [ACLGuard], data: { guard: <ACLType>{ ability: [aclAbility.program.right.publish] } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }



