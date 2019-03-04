import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransmitRoutingModule } from './transmit-routing.module';
import { TransmitComponent } from './transmit.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { TapeDownloadComponent } from './components/tape-download/tape-download.component';
import { HistoricRecordComponent } from './historic-record/historic-record.component';
import { TransmitScheduleComponent } from './components/transmit-schedule/transmit-schedule.component';
import { DownloadRecordComponent } from './download-record/download-record.component';

@NgModule({
  declarations: [
    TransmitComponent,
    TapeDownloadComponent,
    HistoricRecordComponent,
    TransmitScheduleComponent,
    DownloadRecordComponent
  ],
  imports: [
    CommonModule,
    TransmitRoutingModule,
    NgZorroAntdModule,
    FormsModule,
  ],
  entryComponents: [
    TapeDownloadComponent,
    TransmitScheduleComponent
  ]
})
export class TransmitModule { }
