import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ACLAbility {
    program: ProgramACLModule;
    intention: IntentionACLModule;
    custom: ACLModule;
    company: CompanyACLModule;
    review: ReviewACLModule;
    editing: ACLModule;
    analysis: ACLModule;
}

export const aclAbility = <ACLAbility>{
    program: <ProgramACLModule>{
        // name: 'program',
        view: null,
        add: null,
        edit: null,
        del: null,
        publicity: <PublicityACLModule>{
            // name: 'publicity',
            view: null,
            add: null,
            edit: null,
            del: null,
            share: null,
            file: <ACLModule>{
                name: 'publicity_file',
                add: null,
                del: null
            }
        },
        image: <ImageACLModule>{
            // name: 'publicity',
            view: null,
            add: null,
            edit: null,
            del: null,
            share: null,
            file: <ACLModule>{
                name: 'image_file',
                add: null,
                del: null
            }
        },
        source: <SourceACLModule>{
            view: null,
            add: null,
            edit: null,
            del: null,
            // entity: null,
            upload: null,
            download: null,
            publish: null,
            // file: <SourceFileACLModule>{
            //     name: 'source_file',
            //     // add: null,
            //     // del: null,
            //     download: null
            // }
        },
        right: <RightACLModule>{
            view: null,
            add: null,
            edit: null,
            publish: null
        }
    },
    intention: <IntentionACLModule>{
        view: null,
        add: null,
        review: <IntentionReviewACLModule>{
            add: null,
            conf: null,
            pass: null,
            end: null
        }
    },
    custom: <ACLModule>{
        view: null,
        add: null,
        edit: null,
        del: null
    },
    company: <CompanyACLModule>{
        view: null,
        edit: null,
        role: null,
        employee: <EmployeeACLModule>{
            view: null,
            profile: null,
            info: null,
            role: null,
            data: null,
            department: null,
            outside: null
        }
    },
    review: <ReviewACLModule>{
        view: null,
        conf: null,
        edit: null,
    },
    editing: <ACLModule>{
      view: null,
      edit: null
    },
    analysis: <ACLModule>{
      view: null
    }
};

(function (ab) {
    for (const key in ab) {
        if (ab.hasOwnProperty(key)) {
            buildACLAbility(ab[key], key);
        }
    }
})(aclAbility);

function buildACLAbility(ability: ACLModule, name: string) {
    if (!(ability instanceof ACLAbility)) {
        if (typeof ability.name !== 'string') {
            ability.name = name;
        }
    }
    for (const key in ability) {
        if (ability.hasOwnProperty(key)) {
            const item = ability[key];
            if (item instanceof Object) {
                buildACLAbility(item, key);
            } else if (item == null || item === undefined) {
                ability[key] = `${ability.name}_${key}`;
            }
        }
    }
}

interface ACLModule {
    name?: string;
    view?: string;
    add?: string;
    edit?: string;
    del?: string;
}

interface ProgramACLModule extends ACLModule {
    publicity: PublicityACLModule;
    image: ImageACLModule;
    source: SourceACLModule;
    right: RightACLModule;
}

interface ImageACLModule extends ACLModule {
    share?: string;
}

interface PublicityACLModule extends ACLModule {
    share?: string;
}
interface SourceACLModule extends ACLModule {
    // entity?: string;
    upload?: string; // 母带上传
    download?: string; // 母带下载
    publish?: string; // 母带发行
}

interface SourceFileACLModule extends ACLModule {
    download?: string;
}

interface RightACLModule extends ACLModule {
    publish?: string;
}

interface IntentionACLModule extends ACLModule {
    review: IntentionReviewACLModule;
}

interface IntentionReviewACLModule extends ACLModule {
    conf?: string;
    pass?: string;
    end?: string;
}

interface CompanyACLModule extends ACLModule {
    role?: string;
    employee: EmployeeACLModule;
}

interface EmployeeACLModule extends ACLModule {
    profile?: string;
    info?: string;
    role?: string;
    data?: string;
    department?: string;
    outside?: string;
}

interface ReviewACLModule extends ACLModule {
    view?: string;
    conf?: string;
    edit?: string;
}
