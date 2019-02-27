import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@shared';
import { LayoutModule } from 'app/layout/layout.module';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import { SeriesComponent } from './series/series.component';
import { TransmitComponent } from './transmit/transmit.component';

@NgModule({
  declarations: [
    ManageComponent,
    DashboardComponent,
    PersonalCenterComponent,
    TransmitComponent
   ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    FormsModule
  ]
})
export class ManageModule { }
