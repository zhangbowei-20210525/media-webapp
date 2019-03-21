import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriesRoutingModule } from './series-routing.module';
import { CopyrightsComponent } from './copyrights/copyrights.component';
import { PublicitiesComponent } from './publicities/publicities.component';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './details/details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddSeriesInfoComponent } from './components/add-series-info/add-series-info.component';
import { SharedModule } from '@shared';
import { AllSeriesComponent } from './all-series/all-series.component';
import { AddCopyrightsComponent } from './copyrights/add-copyrights/add-copyrights.component';
import { RightComponent } from './details/right/right.component';
import { PublishRightsComponent } from './copyrights/publish-rights/publish-rights.component';
import { AddTapeComponent } from './components/add-tape/add-tape.component';
import { AddPubTapeComponent } from './components/add-pub-tape/add-pub-tape.component';
import { TapesComponent } from './tapes/tapes.component';
import { PublicityDetailsComponent } from './publicities/publicity-details/publicity-details.component';
import { AddPublicityComponent } from './components/add-publicity/add-publicity.component';
import { AddSourceComponent } from './components/add-source/add-source.component';
import { AddRightComponent } from './components/add-right/add-right.component';
import { PublicityComponent } from './details/publicity/publicity.component';
import { TapeComponent } from './details/tape/tape.component';
import { EditTapeInfoComponent } from './components/edit-tape-info/edit-tape-info.component';
import { EditSeriesInfoComponent } from './components/edit-series-info/edit-series-info.component';

@NgModule({
  declarations: [
    SeriesComponent,
    CopyrightsComponent,
    TapesComponent,
    PublicitiesComponent,
    SeriesDetailsComponent,
    PublicityDetailsComponent,
    AddSeriesInfoComponent,
    AllSeriesComponent,
    AddCopyrightsComponent,
    RightComponent,
    PublishRightsComponent,
    AddTapeComponent,
    AddPubTapeComponent,
    AddPublicityComponent,
    AddSourceComponent,
    AddRightComponent,
    PublicityComponent,
    TapeComponent,
    EditTapeInfoComponent,
    EditSeriesInfoComponent,
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
    AddPubTapeComponent,
    AddPublicityComponent,
    AddSourceComponent,
    AddRightComponent,
    EditTapeInfoComponent,
    EditSeriesInfoComponent,
  ]
})
export class SeriesModule { }



