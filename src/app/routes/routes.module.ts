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

@NgModule({
  declarations: [
    MarketComponent, 
    MarketDetailsComponent
  ],
  imports: [
    CommonModule,
    // LayoutModule,
    RouteRoutingModule,
    SharedModule,
    ManageModule,
    PdfViewerModule,
  ]
})
export class RoutesModule { }
