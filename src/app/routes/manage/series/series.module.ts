import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeriesRoutingModule } from './series-routing.module';
import { CopyrightsComponent } from './copyrights/copyrights.component';
import { TapesComponent } from './components/tapes/tapes.component';
import { PublicitiesComponent } from './publicities/publicities.component';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './details/details.component';
import { SeriesDetailsTapeComponent } from './components/series-details-tape/series-details-tape.component';
import { SeriesDetailsCopyrightComponent } from './components/series-details-copyright/series-details-copyright.component';
import { TapeDetailsComponent } from './components/tape-details/tape-details.component';
import { PublicityDetailsComponent } from './components/publicity-details/publicity-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddSeriesInfoComponent } from './components/add-series-info/add-series-info.component';
import { SharedModule } from '@shared';
import { AllSeriesComponent } from './all-series/all-series.component';
import { SeriesDetailsPublicityComponent } from './details/publicity/publicity.component';
import { AddCopyrightsComponent } from './copyrights/add-copyrights/add-copyrights.component';
import { RightComponent } from './details/right/right.component';
import { PublishRightsComponent } from './copyrights/publish-rights/publish-rights.component';
import { AddTapeComponent } from './components/add-tape/add-tape.component';
import { AddPubTapeComponent } from './components/add-pub-tape/add-pub-tape.component';
import { EntityTapeDetailsComponent } from './components/entity-tape-details/entity-tape-details.component';

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
    AllSeriesComponent,
    AddCopyrightsComponent,
    RightComponent,
    PublishRightsComponent,
    AddTapeComponent,
    AddPubTapeComponent,
    EntityTapeDetailsComponent,
  ],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    PdfViewerModule,
    SharedModule,
  ],
  entryComponents: [
    AddSeriesInfoComponent,
    AddTapeComponent,
    AddPubTapeComponent
  ]
})
export class SeriesModule { }



