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
    return this.http.get<ResponseDto<RoleDto[]>>('/api/v1/roles');
  }

  addRole(name: string) {
    return this.http.post<ResponseDto<any>>('/api/v1/roles', { name, permission_data: [] });
  }

  getRolePermissions(id: number) {
    return this.http.get<ResponseDto<PermissionDto[]>>(`/api/v1/roles/${id}`);
  }

  getNzTreeNodes(origins: PermissionDto[]): NzTreeNodeOptions[] {
    const nodes: NzTreeNodeOptions[] = [];
    for (const key in origins) {
      if (origins.hasOwnProperty(key)) {
        const element = origins[key];
        nodes.push({
          title: element.name,
          key: element.code,
          isLeaf: !!element.children && element.children.length < 1,
          expanded: true,
          // checked: !element.status,
          children: this.getNzTreeNodes(element.children)
        });
      }
    }
    return nodes;
  }

  getOwnedPermissionKeys(origins: PermissionDto[]) {
    const keys: string[] = [];
    for (const key in origins) {
      if (origins.hasOwnProperty(key)) {
        const element = origins[key];
        if (element.status) {
          keys.push(element.code);
        }
        if (element.children) {
          keys.push(...this.getOwnedPermissionKeys(element.children));
        }
      }
    }
    return keys;
  }

}
