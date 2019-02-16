import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './series-details/series-details.component';
import { SeriesDetailsTapeComponent } from './components/series-details-tape/series-details-tape.component';
import { SeriesDetailsCopyrightComponent } from './components/series-details-copyright/series-details-copyright.component';
import { TapeDetailsComponent } from './components/tape-details/tape-details.component';
import { PublicityDetailsComponent } from './components/publicity-details/publicity-details.component';
import { SeriesDetailsPublicityComponent } from './series-details/series-details-publicity/series-details-publicity.component';
import { AddCopyrightsComponent } from './copyrights/add-copyrights/add-copyrights.component';


const routes: Routes = [
  {
    path: '',
    component: SeriesComponent
  },
  { path: 'publicity-details/:id', component: PublicityDetailsComponent },
  {
    path: 'details/:sid',
    component: SeriesDetailsComponent,
    children: [
      { path: 'publicity', component: SeriesDetailsPublicityComponent },
      { path: 'copyright', component: SeriesDetailsCopyrightComponent },
      {
        path: 'tape', component: SeriesDetailsTapeComponent,
        children: [
          {
            path: 'tape-details',
            component: TapeDetailsComponent
          }
        ]
      }
    ]
  },
  { path: 'add-copyrights', component: AddCopyrightsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }



