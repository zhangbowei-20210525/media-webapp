import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from './components/sidebar-nav.component';
import { SidebarFooterComponent } from './components/sidebar-footer.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '../shared';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NgZorroAntdModule,
    SharedModule
  ]
})
export class LayoutModule { }
