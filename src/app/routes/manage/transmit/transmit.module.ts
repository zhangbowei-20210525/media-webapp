import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransmitRoutingModule } from './transmit-routing.module';
import { TransmitComponent } from './transmit.component';

@NgModule({
  declarations: [
    TransmitComponent
  ],
  imports: [
    CommonModule,
    TransmitRoutingModule
  ]
})
export class TransmitModule { }
