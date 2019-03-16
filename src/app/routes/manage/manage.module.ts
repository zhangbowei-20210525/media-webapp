import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '@shared';
import { LayoutModule } from 'app/layout/layout.module';
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import { BrowseRecordComponent } from './personal-center/browse-record/browse-record.component';

@NgModule({
  declarations: [
    ManageComponent,
    DashboardComponent,
    PersonalCenterComponent,
    BrowseRecordComponent,
   ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    FormsModule
  ]
})
export class ManageModule { }
