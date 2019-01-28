import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeDetailsDto, EmployeeDepartmentDto, RoleDto } from './dtos';
import { NzTreeNodeOptions } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployeeDetails(id: number) {
    return this.http.get<EmployeeDetailsDto>(`/api/v1/employees/${id}`);
  }

  getEmployeeDepartments(id: number) {
    return this.http.get<EmployeeDepartmentDto[]>(`/api/v1/employees/${id}/department`);
  }

  updateEmployeeDepartments(id: number, department_ids: string[]) {
    return this.http.post<EmployeeDepartmentDto[]>(`/api/v1/employees/${id}/department`, { department_ids });
  }

  getSelectionRoles() {
    return this.http.get<RoleDto[]>('/api/v1/roles');
  }

  updateEmployeeRole(role: number) {
    return this.http.post('/api/v1/employee_roles', {});
  }

  getNzTreeNodes(origins: EmployeeDepartmentDto[]): NzTreeNodeOptions[] {
    const nodes: NzTreeNodeOptions[] = [];
    for (const key in origins) {
      if (origins.hasOwnProperty(key)) {
        const element = origins[key];
        nodes.push({
          title: element.name,
          key: element.id + '',
          isLeaf: !!element.children && element.children.length < 1,
          selectable: false,
          expanded: true,
          children: this.getNzTreeNodes(element.children)
        });
      }
    }
    return nodes;
  }

  getOwnedDepartmentKeys(origins: EmployeeDepartmentDto[]) {
    const keys: string[] = [];
    for (const key in origins) {
      if (origins.hasOwnProperty(key)) {
        const element = origins[key];
        if (element.status) {
          keys.push(element.id + '');
        }
        if (element.children) {
          keys.push(...this.getOwnedDepartmentKeys(element.children));
        }
      }
    }
    return keys;
  }
}
