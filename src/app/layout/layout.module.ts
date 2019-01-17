import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../shared';
import { TopBarComponent } from './top-bar/top-barcomponent';
import { FooterComponent } from './footer/footer.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';

@NgModule({
  declarations: [
    LayoutComponent,
    TopBarComponent,
    FooterComponent,
    SidebarNavComponent,
  ],
  imports: [
    CommonModule,
    // LayoutRoutingModule,
    SharedModule
  ],
  exports: [
    SidebarNavComponent
  ]
})
export class LayoutModule { }
