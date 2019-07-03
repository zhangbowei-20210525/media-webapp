import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransmitComponent } from './transmit.component';
import { HistoricRecordComponent } from './historic-record/historic-record.component';
import { DownloadRecordComponent } from './download-record/download-record.component';
import { DeclaredComponent } from './declared/declared.component';
import { TypeComponent } from './type/type.component';
import { PurTapeDetailsComponent } from './pur-tape-details/pur-tape-details.component';
import { ACLGuard, ACLType } from '@delon/acl';
import { aclAbility } from '@core/acl';

const routes: Routes = [
  {
    path: '',
    component: TransmitComponent,
    canActivate: [ ACLGuard ],
    canActivateChild: [ ACLGuard ],
    data: { guard: <ACLType>{ ability: [aclAbility.program.source.upload, aclAbility.program.source.download] } },
    children: [
      // { path: '', redirectTo: 'declared', pathMatch: 'full' },
      {
        path: 'declared',
        component: DeclaredComponent,
        canActivate: [ ACLGuard ],
        data: { guard: <ACLType>{ ability: [aclAbility.program.source.upload] } }
      },
      {
        path: 'type',
        component: TypeComponent,
        canActivate: [ ACLGuard ],
        data: { guard: <ACLType>{ ability: [aclAbility.program.source.download] } }
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
