export interface DepartmentDto {
    id: number;
    name: string;
    children: DepartmentDto[];
}
