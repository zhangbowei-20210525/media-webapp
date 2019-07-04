import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutsideComponent } from './outside.component';
import { CollectionReceiveComponent } from './collection-receive/collection-receive.component';

const routes: Routes = [
  {
    path: '',
    component: OutsideComponent,
    children: [
      { path: 'collection-receive/:id', component: CollectionReceiveComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutsideRoutingModule { }
