export interface LoginResultDto {
    token: string;
    auth: UserInfoDto;
    permissions: PermissionDto[];
}

export interface UserInfoDto {
    avatar: string;
    company_full_name: string;
    company_id: number;
    company_name: string;
    employee_id: number;
    employee_name: string;
    employee_phone: string;
    id: number;
    introduction: string;
    is_admin: boolean;
    nickname: string;
    phone: string;
    username: string;
    wechat: string;
}

export interface PermissionDto {
    code: string;
    name: string;
    status: boolean;
    children: PermissionDto[];
}
