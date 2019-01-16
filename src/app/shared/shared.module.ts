import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login/login.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from './message/message.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    TranslateModule
  ],
  exports: [TranslateModule],
  providers: [
    LoginService,
    MessageService
  ],
  entryComponents: [
    LoginComponent
  ]
})
export class SharedModule { }
