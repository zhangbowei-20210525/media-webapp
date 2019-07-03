import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageRoutingModule } from './image-routing.module';
import { ImageComponent } from './image.component';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule, SeriesSelectorComponent } from '@shared';
import { LaunchFilmsComponent } from './components/launch-films/launch-films.component';
import { TendencyInfoComponent } from './components/tendency-info/tendency-info.component';
import { CollectionUpComponent } from './components/collection-up/collection-up.component';
import { VerifyFilmsComponent } from './verify-films/verify-films.component';
import { FilmsDetailsComponent } from './films-details/films-details.component';
import { CallUpComponent } from './components/call-up/call-up.component';
import { DetailsSolicitationComponent } from './details-solicitation/details-solicitation.component';
import { FirstInstanceDetailsComponent } from './components/first-instance-details/first-instance-details.component';
import { AdminFilmsDetailsComponent } from './admin-films-details/admin-films-details.component';
@NgModule({
  declarations: [
    ImageComponent,
    ImageDetailsComponent,
    LaunchFilmsComponent,
    TendencyInfoComponent,
    CollectionUpComponent,
    VerifyFilmsComponent,
    FilmsDetailsComponent,
    CallUpComponent,
    DetailsSolicitationComponent,
    FirstInstanceDetailsComponent,
    AdminFilmsDetailsComponent,
  ],
  imports: [
    CommonModule,
    ImageRoutingModule,
    PdfViewerModule,
    SharedModule
  ],
  entryComponents: [
    LaunchFilmsComponent,
    VerifyFilmsComponent,
    FilmsDetailsComponent,
    TendencyInfoComponent,
    CollectionUpComponent,
    CallUpComponent,
    DetailsSolicitationComponent,
    FirstInstanceDetailsComponent,
    AdminFilmsDetailsComponent,
  ]
})
export class ImageModule { }



