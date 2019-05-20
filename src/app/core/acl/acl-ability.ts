export const ACLAbilitykeys = {
    program: <ACLModule>{
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
        source: <SourceACLModule>{
            add: null,
            edit: null,
            del: null,
            entity: null,
            publish: null,
            file: <ACLModule>{
                name: 'source_file',
                add: null,
            }
        },
        right: <RightACLModule>{
            add: null,
            edit: null,
            publish: null
        }
    }

};

declare interface ACLModule {
    name?: string;
    view?: string;
    add?: string;
    edit?: string;
    del?: string;
}

declare interface PublicityACLModule extends ACLModule {
    share?: string;
}

declare interface SourceACLModule extends ACLModule {
    entity?: string;
    publish?: string;
}

declare interface RightACLModule extends ACLModule {
    publish?: string;
}

declare interface IntentionACLModule extends ACLModule {
    conf?: string;
    pass?: string;
    end?: string;
}
