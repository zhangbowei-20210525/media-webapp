import { CopyrightsComponent } from './copyrights/copyrights.component';
import { PublicitiesComponent } from './publicities/publicities.component';
import { AllSeriesComponent } from './all-series/all-series.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './details/details.component';
import { SeriesDetailsTapeComponent } from './components/series-details-tape/series-details-tape.component';
import { SeriesDetailsCopyrightComponent } from './components/series-details-copyright/series-details-copyright.component';
import { AddCopyrightsComponent } from './copyrights/add-copyrights/add-copyrights.component';
import { RightComponent } from './details/right/right.component';
import { PublishRightsComponent } from './copyrights/publish-rights/publish-rights.component';
import { PublicityDetailsComponent } from './publicities/publicity-details/publicity-details.component';
import { TapesComponent } from './tapes/tapes.component';
import { SeriesDetailsPublicityComponent } from './components/series-details-publicity/series-details-publicity.component';


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
      { path: 'publicityd', component: SeriesDetailsPublicityComponent },
      { path: 'right', component: RightComponent },
      { path: 'tape', component: SeriesDetailsTapeComponent }
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



