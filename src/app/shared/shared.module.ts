import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';

// #region services 服务
import { AccountService } from './account/account.service';
import { MessageService } from './message/message.service';

const SERVICES = [
  AccountService,
  MessageService
];
// #endregion

// #region third libs 第三方模块
import { NgZorroAntdModule } from 'ng-zorro-antd';

const THIRD_MODULES = [
  NgZorroAntdModule
];
// #endregion

// #region your componets & directives 组件&指令
import { LoginComponent } from './account/login.component';
import { BindPhoneComponent } from './account/bind-phone.component';
import { BindWechatComponent } from './account/bind-wechat.component';
import { EmptyComponent } from './components/empty/empty.component';

const INSIDE_COMPONENTS = [
  LoginComponent,
  BindPhoneComponent,
  BindWechatComponent
];
const COMPONENTS = [
  EmptyComponent
];
const DIRECTIVES = [];
// #endregion

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ...INSIDE_COMPONENTS,
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    // third libs
    ...THIRD_MODULES,
  ],
  exports: [
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    // third libs
    ...THIRD_MODULES,
    // export components
    ...COMPONENTS,
    // export directives
    ...DIRECTIVES,
  ],
  providers: [
    // servises
    ...SERVICES
  ],
  entryComponents: [
    // inside components
    ...INSIDE_COMPONENTS
  ]
})
export class SharedModule { }
