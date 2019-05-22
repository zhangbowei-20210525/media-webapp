import { NgModule, ModuleWithProviders } from '@angular/core';

import { DelonAuthConfig } from '@delon/auth';
import { DelonFormConfig } from '@delon/form';
import { DelonACLConfig, ACLCanType, ACLType } from '@delon/acl';
import * as _ from 'lodash';

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
    // ...new DelonACLConfig(),
    ...{
      guard_url: '/',
      // preCan: (roleOrAbility: ACLCanType) => {
      //   const str = roleOrAbility.toString();
      //   return str.startsWith('ability.') ? { ability: [ str ] } : null;
      // }
      // preCan: (roleOrAbility: ACLCanType) => {
      //   console.log('roleOrAbility', roleOrAbility);
      //   if (roleOrAbility == null || roleOrAbility === undefined) {
      //     return roleOrAbility;
      //   } else if (_.isString(roleOrAbility)) {
      //     return { role: ['admin', roleOrAbility] };
      //   } else if (_.isNumber(roleOrAbility)) {
      //     return { role: ['admin'], ability: [roleOrAbility] };
      //   } else if (roleOrAbility instanceof Array) {
      //     return {
      //       role: ['admin', ...(roleOrAbility as String[]).filter(item => item instanceof String)],
      //       ability: [...(roleOrAbility as Number[]).filter(item => item instanceof Number)]
      //     };
      //   } else {
      //     const aclType = roleOrAbility as ACLType;
      //     // aclType.role = ['admin', ...(aclType.role || [])];
      //     return aclType;
      //   }
      // }
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
