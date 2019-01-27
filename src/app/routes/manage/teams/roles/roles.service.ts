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
    // if the other array is a falsy value, return
    if (!a || !b)
      return false;

    // compare lengths - can save a lot of time 
    if (a.length != b.length)
      return false;

    for (var i = 0, l = a.length; i < l; i++) {
      // Check if we have nested arrays
      if (a[i] instanceof Array && b[i] instanceof Array) {
        // recurse into the nested arrays
        if (!a[i].equals(b[i]))
          return false;
      }
      else if (a[i] != b[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  }

}
