export interface EmployeeDetailsDto {
    id: number;
    name: string;
    phone: string;
    company_full_name: string;
    company_name: string;
    date_joined: string;
    date_last_login: string;
    is_active: boolean;
    is_admin: boolean;
    is_joined: boolean;
    department: EmployeeDepartmentDto[];
    role: string;
}

export interface EmployeeDepartmentDto {
    id: number;
    name: string;
    status: boolean;
    children: EmployeeDepartmentDto[];
}

export interface RoleDto {
    id: number;
    name: string;
}
