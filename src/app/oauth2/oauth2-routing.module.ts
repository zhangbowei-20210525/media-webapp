import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { WechatComponent } from './wechat/wechat.component';
import { CallbackComponent } from './callback/callback.component';
import { WechatComponent } from './callback/wechat/wechat.component';

const routes: Routes = [
  // {
  //   path: 'wx',
  //   component: WechatComponent
  // }
  {
    path: 'callback',
    component: CallbackComponent,
    children: [
      { path: 'wechat', component: WechatComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Oauth2RoutingModule { }
