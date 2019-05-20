import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { NotifyComponent } from './header/components/notify/notify.component';
import { TaskComponent } from './header/components/task/task.component';

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    MainComponent,
    NotifyComponent,
    TaskComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class LayoutModule { }
