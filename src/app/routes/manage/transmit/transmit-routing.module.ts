import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransmitComponent } from './transmit.component';
import { HistoricRecordComponent } from './historic-record/historic-record.component';
import { DownloadRecordComponent } from './download-record/download-record.component';
import { PurTapeDetailsComponent } from './pur-tape-details/pur-tape-details.component';

const routes: Routes = [
  {
    path: '',
    component: TransmitComponent
  },
  {
    path: 'transmit',
    component: TransmitComponent
  },
  {
    path: 'historic-record/:id',
    component: HistoricRecordComponent
  },
  {
    path: 'download-record/:id',
    component: DownloadRecordComponent
  },
  {
    path: 'pur-d/:id',
    component: PurTapeDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransmitRoutingModule { }
