import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { CopyrightsComponent } from './components/copyrights/copyrights.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TapesComponent } from './components/tapes/tapes.component';
import { PublicitiesComponent } from './components/publicities/publicities.component';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './components/series-details/series-details.component';
import { SeriesDetailsPublicityComponent } from './components/series-details-publicity/series-details-publicity.component';
import { SeriesDetailsTapeComponent } from './components/series-details-tape/series-details-tape.component';
import { SeriesDetailsCopyrightComponent } from './components/series-details-copyright/series-details-copyright.component';
import { TapeDetailsComponent } from './components/tape-details/tape-details.component';
import { PublicityDetailsComponent } from './components/publicity-details/publicity-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddSeriesInfoComponent } from './components/add-series-info/add-series-info.component';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { AddOwnCopyrightComponent } from './components/add-own-copyright/add-own-copyright.component';




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
  ],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    PdfViewerModule,
    ReactiveFormsModule,
    SharedPipesModule,
  ],
  entryComponents: [
    AddSeriesInfoComponent,
    AddOwnCopyrightComponent,
  ]
})
export class SeriesModule { }



