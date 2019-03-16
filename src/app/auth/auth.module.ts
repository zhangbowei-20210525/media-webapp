import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { EmailComponent } from './email/email.component';

@NgModule({
  declarations: [ EmailComponent ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
