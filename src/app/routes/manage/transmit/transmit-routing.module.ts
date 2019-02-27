import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransmitComponent } from './transmit.component';

const routes: Routes = [
  {
    path: '',
    component: TransmitComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransmitRoutingModule { }
