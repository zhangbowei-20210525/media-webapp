import { NgModule, ModuleWithProviders } from '@angular/core';

import { DelonAuthConfig } from '@delon/auth';
import { DelonFormConfig } from '@delon/form';
import { DelonACLConfig, ACLCanType } from '@delon/acl';

export function delonAuthConfigFactory(): DelonAuthConfig {
  return Object.assign(new DelonAuthConfig(), <DelonAuthConfig>{
    login_url: '/',
    ignores: [/assets\//]
  });
}
export function delonFormConfigFactory(): DelonFormConfig {
  return Object.assign(new DelonFormConfig(), <DelonFormConfig>{
    // values
  });
}

export function delonACLConfigFactory(): DelonACLConfig {
  return {
    ...new DelonACLConfig(),
    ...{
      preCan: (roleOrAbility: ACLCanType) => {
        const str = roleOrAbility.toString();
        return str.startsWith('ability.') ? { ability: [ str ] } : null;
      }
    } as DelonACLConfig
  };
}

@NgModule({})
export class DelonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DelonModule,
      providers: [
        { provide: DelonAuthConfig, useFactory: delonAuthConfigFactory },
        { provide: DelonFormConfig, useFactory: delonFormConfigFactory },
        { provide: DelonACLConfig, useFactory: delonACLConfigFactory }
      ]
    };
  }
}
