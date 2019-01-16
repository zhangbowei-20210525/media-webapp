export interface User {
    [key: string]: any;
    /** Name for current user */
    name?: string;
    /** Avatar for current user */
    avatar?: string;
    /** Email for current user */
    email?: string;
}

export interface SettingsNotify {
    type: 'lang' | 'user';
    /** Update `key` name, limited `layout` type */
    name?: string;

    value: any;
}
