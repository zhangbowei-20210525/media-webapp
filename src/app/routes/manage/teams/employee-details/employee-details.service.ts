import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeDetailsDto, EmployeeDepartmentDto, RoleDto, PermissionDto } from './dtos';
import { NzTreeNodeOptions, NzTreeNode } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployeeDetails(id: number) {
    return this.http.get<EmployeeDetailsDto>(`/api/v1/companies/employees/${id}`);
  }

  getEmployeeDepartments(id: number) {
    return this.http.get<EmployeeDepartmentDto[]>(`/api/v1/companies/employees/${id}/department`);
  }

  updateEmployeeDepartments(id: number, department_ids: string[]) {
    return this.http.post<EmployeeDepartmentDto[]>(`/api/v1/companies/employees/${id}/department`, { department_ids });
  }

  updateEmployeeRole(employee: number, role_id: number, is_cover: boolean) {
    return this.http.post<PermissionDto[]>(`/api/v1/companies/employees/${employee}/role`, { role_id, is_cover });
  }

  getRoleTemplates() {
    return this.http.get<RoleDto[]>('/api/v1/companies/roles');
  }

  getEmployeePermissions(id: number) {
    return this.http.get<{ role: number[], permission_data: PermissionDto[] }>(`/api/v1/companies/employees/${id}/permissions`);
  }

  updateEmployeePermissions(id: number, permission_data: string[], role_data: number[]) {
    return this.http.post<PermissionDto[]>(`/api/v1/companies/employees/${id}/permissions`, { permission_data, role_data });
  }

  updateSeriesPermission(employee: number, status: boolean, program_ids: number[]) {
    return this.http.post<any>(`/api/v1/companies/employees/${employee}/programs`, { status, program_ids });
  }

  editEmployee(id: number, name: string/*, phone: string */) {
    return this.http.put<EmployeeDetailsDto>(`/api/v1/companies/employees/${id}`, { name/*, phone*/ });
  }

  saveInfo(id: number, name: string, department_ids: any[], outside_name: string, outside_phone: string, outside_position: string) {
    return this.http.put<any>(`/api/v1/companies/employees/${id}`, {
      id: id,
      name: name,
      department_ids: department_ids,
      outside_name: outside_name,
      outside_phone: outside_phone,
      outside_position: outside_position
     });
  }
}
