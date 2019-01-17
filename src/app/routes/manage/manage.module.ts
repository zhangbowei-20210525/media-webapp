import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@shared';
import { LayoutModule } from 'app/layout/layout.module';
import { PersonalCenterComponent } from './personal-center/personal-center.component';

@NgModule({
  declarations: [ManageComponent, DashboardComponent, PersonalCenterComponent],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule
  ]
})
export class ManageModule { }
