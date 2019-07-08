import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { WechatComponent } from './wechat/wechat.component';
import { Oauth2RoutingModule } from './oauth2-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CallbackComponent } from './callback/callback.component';
import { WechatComponent } from './callback/wechat/wechat.component';

@NgModule({
  declarations: [CallbackComponent, WechatComponent],
  imports: [
    CommonModule,
    Oauth2RoutingModule,
    SharedModule
  ]
})
export class Oauth2Module { }
