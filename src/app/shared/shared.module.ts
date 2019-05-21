import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';

// #region services 服务
import { AccountService } from './account/account.service';
import { MessageService } from './message/message.service';
import { TreeService } from './components/tree.service';

const SERVICES = [
  AccountService,
  MessageService,
  TreeService
];
// #endregion

// #region third libs 第三方模块
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DelonACLModule } from '@delon/acl';

const THIRD_MODULES = [
  NgZorroAntdModule,
  DelonACLModule
];
// #endregion

// #region your componets & directives & pipes 组件&指令&管道
import { LoginComponent } from './account/login.component';
import { BindPhoneComponent } from './account/bind-phone.component';
import { BindWechatComponent } from './account/bind-wechat.component';
import { EmptyComponent } from './components/empty/empty.component';
import { SeriesSelectorComponent } from './components/series-selector/series-selector.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TagMergeComponent } from './components/tag-merge/tag-merge.component';

const INSIDE_COMPONENTS = [
  LoginComponent,
  BindPhoneComponent,
  BindWechatComponent
];
const COMPONENTS = [
  EmptyComponent,
  SeriesSelectorComponent,
  LoadingComponent,
  TagMergeComponent
];

const DIRECTIVES = [];

import { SeriesTypePipe } from './pipes/series-type.pipe';
import { PointFormatPipe } from './pipes/point-format.pipe';
import { SrcToUrlPipe } from './pipes/src-to-url.pipe';
import { ProgressFormatPipe } from './pipes/progress-format.pipe';
import { ByteFormatPipe } from './pipes/byte-format.pipe';
import { FloorPipe } from './pipes/floor.pipe';
import { InvestmentTypePipe } from './pipes/investment-type.pipe';
import { DefaultCharPipe } from './pipes/default-char.pipe';
import { ArrayFormatPipe } from './pipes/array-format.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { YesOrNoPipe } from './pipes/yes-or-no.pipe';
import { PaymentFormatPipe } from './pipes/payment-format.pipe';
import { ArrayMapPipe } from './pipes/array-map.pipe';

const PIPES = [
  SeriesTypePipe,
  PointFormatPipe,
  SrcToUrlPipe,
  ProgressFormatPipe,
  ByteFormatPipe,
  FloorPipe,
  InvestmentTypePipe,
  DefaultCharPipe,
  ArrayFormatPipe,
  TruncatePipe,
  YesOrNoPipe,
  PaymentFormatPipe,
  ArrayMapPipe
];
// #endregion

import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientJsonpModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    ...INSIDE_COMPONENTS,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientJsonpModule,
    DragDropModule,
    // third libs
    ...THIRD_MODULES,
  ],
  exports: [
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    // third libs
    ...THIRD_MODULES,
    // export components
    ...COMPONENTS,
    // export directives
    ...DIRECTIVES,
    // export pipes
    ...PIPES
  ],
  providers: [
    // servises
    // ...SERVICES
  ],
  entryComponents: [
    // inside components
    ...INSIDE_COMPONENTS
  ]
})
export class SharedModule { }
