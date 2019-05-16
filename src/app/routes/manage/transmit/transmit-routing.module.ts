import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransmitComponent } from './transmit.component';
import { HistoricRecordComponent } from './historic-record/historic-record.component';
import { DownloadRecordComponent } from './download-record/download-record.component';
import { DeclaredComponent } from './declared/declared.component';
import { TypeComponent } from './type/type.component';

const routes: Routes = [
  {
    path: '',
    component: TransmitComponent,
    children: [
      {path: '', redirectTo: 'declared', pathMatch: 'full'},
      {
        path: 'declared',
        component: DeclaredComponent
      },
      {
        path: 'type',
        component: TypeComponent
      }
    ]
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransmitRoutingModule { }
