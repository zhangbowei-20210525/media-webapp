import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteRoutingModule } from './routes-routing.module';
import { SharedModule } from '../shared';
import { MarketComponent } from './market/market.component';
import { ManageModule } from './manage/manage.module';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [MarketComponent],
  imports: [
    CommonModule,
    // LayoutModule,
    RouteRoutingModule,
    SharedModule,
    ManageModule
  ]
})
export class RoutesModule { }
