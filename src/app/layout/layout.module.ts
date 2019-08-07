import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { NotifyComponent } from './header/components/notify/notify.component';
import { TaskComponent } from './header/components/task/task.component';
import { PassportComponent } from './passport/passport.component';
import { SystemMessagesComponent } from './header/components/system-messages/system-messages.component';
import { TapeMessagesComponent } from './header/components/tape-messages/tape-messages.component';
import { ExternalMessagesComponent } from './header/components/external-messages/external-messages.component';
import { SolicitationComponent } from './header/components/solicitation/solicitation.component';

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    MainComponent,
    NotifyComponent,
    TaskComponent,
    PassportComponent,
    SystemMessagesComponent,
    TapeMessagesComponent,
    ExternalMessagesComponent,
    SolicitationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents: [
    SystemMessagesComponent,
    TapeMessagesComponent,
    ExternalMessagesComponent,
    SolicitationComponent
  ]
})
export class LayoutModule { }
