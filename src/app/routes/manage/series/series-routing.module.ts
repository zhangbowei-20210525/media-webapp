import { CopyrightsComponent } from './copyrights/copyrights.component';
import { PublicitiesComponent } from './publicities/publicities.component';
import { AllSeriesComponent } from './all-series/all-series.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './details/details.component';
import { SeriesDetailsTapeComponent } from './components/series-details-tape/series-details-tape.component';
// import { SeriesDetailsCopyrightComponent } from './components/series-details-copyright/series-details-copyright.component';
import { TapeDetailsComponent } from './components/tape-details/tape-details.component';
import { PublicityDetailsComponent } from './components/publicity-details/publicity-details.component';
import { SeriesDetailsPublicityComponent } from './details/publicity/publicity.component';
import { AddCopyrightsComponent } from './copyrights/add-copyrights/add-copyrights.component';
import { RightComponent } from './details/right/right.component';
import { PublishRightsComponent } from './copyrights/publish-rights/publish-rights.component';
import { EntityTapeDetailsComponent } from './components/entity-tape-details/entity-tape-details.component';


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
      // {
      //   path: 'tapes',
      //   component: AllSeriesComponent
      // },
      {
        path: 'rights',
        component: CopyrightsComponent
      }
    ]
  },
  { path: 'publicity-details/:id', component: PublicityDetailsComponent },
  {
    path: 'd/:sid',
    component: SeriesDetailsComponent,
    children: [
      { path: 'publicity', component: SeriesDetailsPublicityComponent },
      { path: 'right', component:  RightComponent},
      {
        path: 'tape', component: SeriesDetailsTapeComponent,
        children: [
          {
            path: 'tape-details',
            component: TapeDetailsComponent
          },
          {
            path: 'entity-tape-details',
            component: EntityTapeDetailsComponent
          },
        ]
      }
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



