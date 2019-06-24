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
  ],
  imports: [
    CommonModule,
    LayoutModule,
    RouteRoutingModule,
    SharedModule,
    ManageModule,
    PdfViewerModule,
  ]
})
export class RoutesModule { }
