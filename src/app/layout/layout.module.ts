import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../shared';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { NavNotifyComponent } from './components/nav-notify/nav-notify.component';
import { NavTasksComponent } from './components/nav-tasks/nav-tasks.component';

@NgModule({
  declarations: [
    LayoutComponent,
    TopBarComponent,
    FooterComponent,
    SidebarNavComponent,
    NavNotifyComponent,
    NavTasksComponent,
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
