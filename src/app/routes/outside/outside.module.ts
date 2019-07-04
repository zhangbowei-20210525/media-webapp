import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutsideComponent } from './outside.component';
import { CollectionReceiveComponent } from './collection-receive/collection-receive.component';
import { OutsideRoutingModule } from './outside-routing.module';

@NgModule({
  declarations: [
    OutsideComponent,
    CollectionReceiveComponent
  ],
  imports: [
    CommonModule,
    OutsideRoutingModule
  ]
})
export class OutsideModule { }
