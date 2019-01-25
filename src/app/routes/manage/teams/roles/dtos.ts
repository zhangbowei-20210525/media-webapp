export interface RoleDto {
    id: number;
    name: string;
    loading: boolean;
}

export interface PermissionDto {
    code: string;
    name: string;
    status: boolean;
    children: PermissionDto[];
}
