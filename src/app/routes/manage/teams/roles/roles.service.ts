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
    return this.http.get<RoleDto[]>('/api/v1/roles');
  }

  addRole(name: string) {
    return this.http.post<any>('/api/v1/roles', { name, permission_data: [] });
  }

  getRolePermissions(id: number) {
    return this.http.get<PermissionDto[]>(`/api/v1/roles/${id}`);
  }

  updateRolePermissions(roleId: number, permission_data: string[]) {
    return this.http.put(`/api/v1/roles/${roleId}`, { permission_data });
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
          selectable: false,
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

  equalsArrayItems(a: Array<any>, b: Array<any>) {
    if (!a || !b) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0, l = a.length; i < l; i++) {
      if (a[i] instanceof Array && b[i] instanceof Array) {
        if (!a[i].equals(b[i])) {
          return false;
        }
      } else if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

}
