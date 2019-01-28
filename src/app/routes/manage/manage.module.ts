import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared';
import { SidebarNavComponent } from 'src/app/layout/sidebar-nav/sidebar-nav.component';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SeriesComponent } from './series/series.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManageComponent,
    DashboardComponent,
   ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    FormsModule,
  ]
})
export class ManageModule { }
