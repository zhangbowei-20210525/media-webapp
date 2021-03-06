import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SeriesRoutingModule } from './series-routing.module';
import { CopyrightsComponent } from './copyrights/copyrights.component';
import { PublicitiesComponent } from './publicities/publicities.component';
import { SeriesComponent } from './series.component';
import { SeriesDetailsComponent } from './details/details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AddSeriesInfoComponent } from './components/add-series-info/add-series-info.component';
import { SharedModule, SeriesSelectorComponent } from '@shared';
import { AllSeriesComponent } from './all-series/all-series.component';
import { AddCopyrightsComponent } from './copyrights/add-copyrights/add-copyrights.component';
import { RightComponent } from './details/right/right.component';
import { PublishRightsComponent } from './copyrights/publish-rights/publish-rights.component';
import { AddTapeComponent } from './components/add-tape/add-tape.component';
import { DeleteTapeComponent } from './components/delete-tape/delete-tape.component';
import { AddPubTapeComponent } from './components/add-pub-tape/add-pub-tape.component';
import { TapesComponent } from './tapes/tapes.component';
import { PublicityDetailsComponent } from './publicities/publicity-details/publicity-details.component';
import { AddPublicityComponent } from './components/add-publicity/add-publicity.component';
import { PublicityComponent } from './details/publicity/publicity.component';
import { TapeComponent } from './details/tape/tape.component';
import { EditTapeInfoComponent } from './components/edit-tape-info/edit-tape-info.component';
import { EditSeriesInfoComponent } from './components/edit-series-info/edit-series-info.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ProcurementComponent } from './contracts/procurement/procurement.component';
import { PublishedComponent } from './contracts/published/published.component';
import { PublishedComponent as PublishedListComponent } from './copyrights/published/published.component';
import { AllRightsComponent } from './copyrights/all-rights/all-rights.component';
import { RelationImportFieldComponent } from './components/relation-import-field/relation-import-field.component';
import { ContractDetailsComponent } from './contracts/contract-details/contract-details.component';
import { RightFilterComponent } from './components/right-filter/right-filter.component';
import { PublicityFilmsComponent } from './components/publicity-films/publicity-films.component';
import { SeriesConfigComponent } from './series-config/series-config.component';
import { ConfigMergeComponent } from './series-config/components/config-merge/config-merge.component';
import { StMergeComponent } from './series-config/components/st-merge/st-merge.component';
import { ItMergeComponent } from './series-config/components/it-merge/it-merge.component';
import { TtMergeComponent } from './series-config/components/tt-merge/tt-merge.component';
import { DeliveryCopyrightComponent } from './components/delivery-copyright/delivery-copyright.component';


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
    DeleteTapeComponent,
    AddPubTapeComponent,
    AddPublicityComponent,
    PublicityComponent,
    TapeComponent,
    EditTapeInfoComponent,
    EditSeriesInfoComponent,
    ContractsComponent,
    ProcurementComponent,
    PublishedComponent,
    PublishedListComponent,
    AllRightsComponent,
    RelationImportFieldComponent,
    ContractDetailsComponent,
    RightFilterComponent,
    PublicityFilmsComponent,
    ConfigMergeComponent,
    SeriesConfigComponent,
    StMergeComponent,
    ItMergeComponent,
    TtMergeComponent,
    DeliveryCopyrightComponent,
  ],
  imports: [
    CommonModule,
    SeriesRoutingModule,
    PdfViewerModule,
    SharedModule,
    DragDropModule
  ],
  entryComponents: [
    AddSeriesInfoComponent,
    AddTapeComponent,
    DeleteTapeComponent,
    AddPubTapeComponent,
    AddPublicityComponent,
    EditTapeInfoComponent,
    EditSeriesInfoComponent,
    SeriesSelectorComponent,
    RelationImportFieldComponent,
    RightFilterComponent,
    PublicityFilmsComponent,
    DeliveryCopyrightComponent,
  ]
})
export class SeriesModule { }



