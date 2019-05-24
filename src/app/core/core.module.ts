import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { aclAbility, ACLAbility } from './acl';
import { NotifiesPolling } from './notifies/notifies-polling';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    NotifiesPolling,
    SelectivePreloadingStrategy,
    { provide: ACLAbility, useValue: aclAbility }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
