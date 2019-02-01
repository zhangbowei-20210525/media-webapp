import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { CopyrightsComponent } from './copyrights/copyrights.component';
import { TapesComponent } from './components/tapes/tapes.component';
import { PublicitiesComponent } from './publicities/publicities.component';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './series-details/series-details.component';
import { SeriesDetailsTapeComponent } from './components/series-details-tape/series-details-tape.component';
import { SeriesDetailsCopyrightComponent } from './components/series-details-copyright/series-details-copyright.component';
import { TapeDetailsComponent } from './components/tape-details/tape-details.component';
import { PublicityDetailsComponent } from './components/publicity-details/publicity-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddSeriesInfoComponent } from './components/add-series-info/add-series-info.component';
import { AddOwnCopyrightComponent } from './components/add-own-copyright/add-own-copyright.component';
import { SharedModule } from '@shared';
import { AllSeriesComponent } from './all-series/all-series.component';
import { SeriesDetailsPublicityComponent } from './series-details/series-details-publicity/series-details-publicity.component';

@NgModule({
  declarations: [
    SeriesComponent,
    CopyrightsComponent,
    TapesComponent,
    PublicitiesComponent,
    SeriesDetailsComponent,
    SeriesDetailsPublicityComponent,
    SeriesDetailsTapeComponent,
    SeriesDetailsCopyrightComponent,
    TapeDetailsComponent,
    PublicityDetailsComponent,
    AddSeriesInfoComponent,
    AddOwnCopyrightComponent,
    AllSeriesComponent,
  ],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    PdfViewerModule,
    SharedModule
  ],
  entryComponents: [
    AddSeriesInfoComponent,
    AddOwnCopyrightComponent,
  ]
})
export class SeriesModule { }



