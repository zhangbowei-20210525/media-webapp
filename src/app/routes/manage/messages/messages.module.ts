import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { SharedModule } from '@shared';



@NgModule({
  declarations: [
    MessagesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MessagesRoutingModule
  ]
})
export class MessagesModule { }
