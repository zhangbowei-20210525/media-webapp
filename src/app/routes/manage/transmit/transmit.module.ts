import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransmitRoutingModule } from './transmit-routing.module';
import { TransmitComponent } from './transmit.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { TapeDownloadComponent } from './components/tape-download/tape-download.component';
import { DeclaredComponent } from './declared/declared.component';
import { TypeComponent } from './type/type.component';
import { HistoricRecordComponent } from './historic-record/historic-record.component';
import { TransmitScheduleComponent } from './components/transmit-schedule/transmit-schedule.component';
import { DownloadRecordComponent } from './download-record/download-record.component';
import { SharedModule } from '@shared';
import { PurTapeDetailsComponent } from './pur-tape-details/pur-tape-details.component';

@NgModule({
  declarations: [
    TransmitComponent,
    TapeDownloadComponent,
    HistoricRecordComponent,
    TransmitScheduleComponent,
    DownloadRecordComponent,
    DeclaredComponent,
    TypeComponent,
    PurTapeDetailsComponent
  ],
  imports: [
    CommonModule,
    TransmitRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    SharedModule
  ],
  entryComponents: [
    TapeDownloadComponent,
    TransmitScheduleComponent
  ]
})
export class TransmitModule { }
