import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WechatComponent } from './wechat/wechat.component';

const routes: Routes = [
  {
    path: 'wx',
    component: WechatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Oauth2RoutingModule { }
