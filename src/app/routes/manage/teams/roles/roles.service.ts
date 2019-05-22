import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseDto } from '@shared';
import { RoleDto, PermissionDto } from './dtos';
import { NzTreeNodeOptions } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private http: HttpClient
  ) { }

  getRoles() {
    return this.http.get<RoleDto[]>('/api/v1/companies/roles');
  }

  addRole(name: string) {
    return this.http.post<any>('/api/v1/companies/roles', { name, permission_data: [] });
  }

  deleteRole(id: number) {
    return this.http.delete(`/api/v1/companies/roles/${id}`);
  }

  getRolePermissions(id: number) {
    return this.http.get<PermissionDto[]>(`/api/v1/companies/roles/${id}`);
  }

  updateRolePermissions(roleId: number, permission_data: string[]) {
    return this.http.put(`/api/v1/companies/roles/${roleId}`, { permission_data });
  }

}
