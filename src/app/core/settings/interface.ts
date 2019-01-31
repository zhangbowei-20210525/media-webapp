export interface User {
    [key: string]: any;
    /** User ID for current user */
    id: number;
    /** User name for current user */
    username: string;
    /** Nick name for current user */
    nickname?: string;
    /** Avatar for current user */
    avatar?: string;
    /** Phone for current user */
    phone?: string;
    /** Company ID for current user */
    company_id: number;
    /** Company name for current user */
    company_name: string;
    /** Company full name for current user */
    company_full_name: string;
    /** Is default company for current user */
    is_default_company: boolean;
    /** Employee id for current user */
    employee_id: number;
    /** Employee name for current user */
    employee_name: string;
    /** Employee phone name for current user */
    employee_phone: string;
}

export interface SettingsNotify {
    type: 'lang' | 'user';
    /** Update `key` name, limited `layout` type */
    name?: string;

    value: any;
}
