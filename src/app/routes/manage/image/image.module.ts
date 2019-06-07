import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageRoutingModule } from './image-routing.module';
import { ImageComponent } from './image.component';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule, SeriesSelectorComponent } from '@shared';


@NgModule({
  declarations: [
    ImageComponent,
    ImageDetailsComponent,
  ],
  imports: [
    CommonModule,
    ImageRoutingModule,
    PdfViewerModule,
    SharedModule
  ],
  entryComponents: [

  ]
})
export class ImageModule { }



