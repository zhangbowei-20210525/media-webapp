import { NgModule, ModuleWithProviders } from '@angular/core';

import { DelonAuthConfig } from '@delon/auth';
import { DelonFormConfig } from '@delon/form';
export function delonAuthConfig(): DelonAuthConfig {
  return Object.assign(new DelonAuthConfig(), <DelonAuthConfig>{
    login_url: '/',
    ignores: [/assets\//]
  });
}
export function fnDelonFormConfig(): DelonFormConfig {
  return Object.assign(new DelonFormConfig(), <DelonFormConfig>{
    // values
  });
}

@NgModule({})
export class DelonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DelonModule,
      providers: [
        { provide: DelonAuthConfig, useFactory: delonAuthConfig },
        { provide: DelonFormConfig, useFactory: fnDelonFormConfig }
      ]
    };
  }
}
