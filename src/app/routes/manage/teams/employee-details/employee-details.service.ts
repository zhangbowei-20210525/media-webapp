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

  getSelectionRoles() {
    return this.http.get<RoleDto[]>('/api/v1/companies/roles');
  }

  updateEmployeeRole(employee: number, role_id: number, is_cover: boolean) {
    return this.http.post<PermissionDto[]>(`/api/v1/companies/employees/${employee}/role`, { role_id, is_cover });
  }

  getEmployeePermissions(id: number) {
    return this.http.get<PermissionDto[]>(`/api/v1/companies/employees/${id}/permissions`);
  }

  updateEmployeePermissions(id: number, permission_data: PermissionDto[]) {
    return this.http.post(`/api/v1/companies/employees/${id}/permissions`, { permission_data });
  }

  updateSeriesPermission(employee: number, status: boolean, program_ids: number[]) {
    return this.http.post<any>(`/api/v1/companies/employees/${employee}/programs`, { status, program_ids });
  }

}
