import { DashboardComponent } from './manage/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteRoutingModule } from './routes-routing.module';
import { SharedModule } from '../shared';
import { MarketComponent } from './market/market.component';
import { ManageModule } from './manage/manage.module';
import { LayoutModule } from '../layout/layout.module';
import { MarketDetailsComponent } from './market/market-details/market-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoginComponent } from './passport/login/login.component';
import { PhoneLoginComponent } from './passport/login/phone-login/phone-login.component';
import { WechatLoginComponent } from './passport/login/wechat-login/wechat-login.component';
import { BindingComponent } from './passport/binding/binding.component';
import { PhoneBindingComponent } from './passport/binding/phone-binding/phone-binding.component';
import { CompanyBindingComponent } from './passport/binding/company-binding/company-binding.component';
import { ChoreographyComponent } from './manage/choreography/choreography.component';
import { TheatreComponent } from './manage/choreography/theatre/theatre.component';
import { InfoComponent } from './manage/choreography/info/info.component';
import { EditBroadcastPlanComponent } from './manage/choreography/edit-broadcast-plan/edit-broadcast-plan.component';
import { AddTheatreComponent } from './manage/choreography/components/add-theatre/add-theatre.component';
import { AddBroadcastingInfoComponent } from './manage/choreography/components/add-broadcasting-info/add-broadcasting-info.component';
import { InsertBroadcastInfoComponent } from './manage/choreography/components/insert-broadcast-info/insert-broadcast-info.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    MarketComponent,
    MarketDetailsComponent,
    LoginComponent,
    PhoneLoginComponent,
    WechatLoginComponent,
    BindingComponent,
    PhoneBindingComponent,
    CompanyBindingComponent,
    ChoreographyComponent,
    TheatreComponent,
    InfoComponent,
    AddTheatreComponent,
    EditBroadcastPlanComponent,
    InsertBroadcastInfoComponent,
    AddBroadcastingInfoComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    RouteRoutingModule,
    SharedModule,
    ManageModule,
    PdfViewerModule,
    DragDropModule
  ],
  entryComponents: [
    AddTheatreComponent,
    InsertBroadcastInfoComponent,
    AddBroadcastingInfoComponent,
  ]
})
export class RoutesModule { }
