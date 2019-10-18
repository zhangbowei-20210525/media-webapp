export interface CompanyDto {
    company_id: number;
    company_name: string;
    company_full_name: string;
    introduction: string;
    is_default_company: boolean;
    phone: string;
}

export interface DepartmentDto {
    id: number;
    name: string;
    children: DepartmentDto[];
}
