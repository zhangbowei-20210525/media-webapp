import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './components/series-details/series-details.component';
import { SeriesDetailsPublicityComponent } from './components/series-details-publicity/series-details-publicity.component';
import { SeriesDetailsTapeComponent } from './components/series-details-tape/series-details-tape.component';
import { SeriesDetailsCopyrightComponent } from './components/series-details-copyright/series-details-copyright.component';
import { TapeDetailsComponent } from './components/tape-details/tape-details.component';
import { PublicityDetailsComponent } from './components/publicity-details/publicity-details.component';
import { EntityTapeDetailsComponent } from './components/entity-tape-details/entity-tape-details.component';


const routes: Routes = [
  {
    path: '',
    component: SeriesComponent
  },
  {
    path: 'publicity-details/:id',
    component: PublicityDetailsComponent
  },
  {
    path: 'series-details/:sid',
    component: SeriesDetailsComponent,
    children: [
      {path: 'series-details-publicity', component: SeriesDetailsPublicityComponent},
      {path: 'series-details-copyright', component: SeriesDetailsCopyrightComponent},
      {path: 'series-details-tape', component: SeriesDetailsTapeComponent,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeriesRoutingModule { }



