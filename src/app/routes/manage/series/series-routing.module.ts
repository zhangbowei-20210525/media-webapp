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
import { PubRightsComponent } from './copyrights/pub-rights/pub-rights.component';
import { SwitchRightComponent } from './switch-right/switch-right.component';



const routes: Routes = [
  {
    path: '',
    component: SeriesComponent,
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      {
        path: 'all',
        component: AllSeriesComponent
      },
      {
        path: 'publicity',
        component: PublicitiesComponent
      },
      {
        path: 'tapes',
        component: TapesComponent
      },
      {
        path: 'switchRight',
        component: SwitchRightComponent,
        children: [
          { path: '', redirectTo: 'rights', pathMatch: 'full' },
          {
            path: 'rights',
            component: CopyrightsComponent
          },
          {
            path: 'pubRights',
            component: PubRightsComponent
          },
        ]
      }
    ]
  },
  { path: 'publicity-details/:id', component: PublicityDetailsComponent },
  {
    path: 'd/:sid',
    component: SeriesDetailsComponent,
    children: [
      { path: 'publicityd', component: PublicityComponent },
      { path: 'right', component: RightComponent },
      { path: 'tape', component: TapeComponent }
    ]
  },
  { path: 'add-copyrights', component: AddCopyrightsComponent },
  { path: 'publish-rights', component: PublishRightsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }



