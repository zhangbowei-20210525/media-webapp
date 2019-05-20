import { finalize } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RolesService } from './roles.service';
import { NzMessageService, NzFormatEmitEvent, NzTreeNodeOptions, NzTreeComponent, NzTreeNode, NzModalService } from 'ng-zorro-antd';
import { RoleDto, PermissionDto } from './dtos';
import { TreeService } from '@shared';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.less']
})
export class RolesComponent implements OnInit {

  @ViewChild('permissionTree') permissionTreeCom: NzTreeComponent;

  roles: RoleDto[];

  originCheckedKeys: string[];

  isLoaded = false;
  isEditable = false;
  permissionNodes: NzTreeNodeOptions[];
  selectedRole: RoleDto;
  addRoleVisible = false;

  constructor(
    private service: RolesService,
    private message: NzMessageService,
    private modal: NzModalService,
    private ts: TreeService
  ) { }

  ngOnInit() {
    this.fetchRoles();
  }

  fetchRoles() {
    this.service.getRoles().pipe(finalize(() => this.isLoaded = true)).subscribe(result => {
      this.roles = result;
      this.selectedRole = this.roles[0];
      this.onRoleChange();
    });
  }

  fetchPermissions(id: number) {
    this.service.getRolePermissions(id).subscribe(permissions => {
      this.setOriginCheckedKeysByPermissions(permissions);
      this.setPermissionNodes(permissions, this.originCheckedKeys);
    });
  }

  setPermissionNodes(permissions: PermissionDto[], checkedKeys?: string[]) {
    this.permissionNodes = this.ts.getNzTreeNodes(permissions, item => ({
      title: item.name,
      key: item.code,
      isLeaf: !!item.children && item.children.length < 1,
      selectable: false,
      expanded: false,
      disableCheckbox: true,
      checked: false // checkedKeys.some(key => key === item.code),
    }));
    if (checkedKeys) {
      setTimeout(() => {
        this.setCheckedNodesByKeys(checkedKeys);
      }, 0);
    }
  }

  setOriginCheckedKeysByPermissions(permissions: PermissionDto[]) {
    this.originCheckedKeys = this.ts.recursionNodesMapArray(permissions, p => p.code, p =>
      p.status && (!p.children || p.children.length < 1));
  }

  setCheckedNodesByKeys(keys: string[]) {
    const nodes = this.permissionTreeCom.getTreeNodes();
    this.ts.recursionNodes(nodes, node => {
      node.isChecked = keys.some(k => k === node.key);
      if (node.parentNode) {
        this.syncChecked(node.parentNode);
      }
    });
  }

  onRoleChange() {
    if (this.isEditable) {
      this.setEditable(false);
    }
    this.permissionNodes = [];
    this.fetchPermissions(this.selectedRole.id);
  }

  setEditable(state: boolean, syncOriginChecked = true) {
    this.isEditable = state;
    this.ts.setDisableCheckbox(this.permissionTreeCom.nzNodes, !state);
    if (!state && syncOriginChecked) {
      this.setCheckedNodesByKeys(this.originCheckedKeys);
    }
  }

  syncChecked(node: NzTreeNode) {
    const { isChecked, isHalfChecked } = node;
    node.isChecked = node.children.every(n => n.isChecked);
    if (node.isChecked) {
      node.isHalfChecked = false;
    } else {
      node.isHalfChecked = node.children.some(n => n.isChecked || n.isHalfChecked);
    }
    if (node.isChecked === isChecked && node.isHalfChecked === isHalfChecked) {
      return;
    }
    if (node.parentNode) {
      this.syncChecked(node.parentNode);
    }
  }

  savePermissions() {
    const nodes = this.permissionTreeCom.getTreeNodes();
    const permissionKeys = this.ts.recursionNodesMapArray(nodes, node => node.key, node => node.isChecked || node.isHalfChecked);
    this.service.updateRolePermissions(this.selectedRole.id, permissionKeys).subscribe(result => {
      this.message.success('修改成功');
      this.setEditable(false, false);
    });
  }

  confirmAddRole(roleName: string) {
    if (this.roles.some(r => r.name === roleName)) {
      this.message.warning('已存在此角色');
      return;
    }
    this.service.addRole(roleName).subscribe(result => {
      this.message.success('新增角色成功');
      this.roles = [...this.roles, {
        id: result.id,
        name: roleName,
        loading: false
      }];
      this.addRoleVisible = false;
    });
  }

  cancelAddRole() {
    this.addRoleVisible = false;
  }

  deleteRole() {
    const role = this.selectedRole;
    this.modal.confirm({
      nzTitle: `是否删除角色 ${role.name}`,
      nzNoAnimation: true,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.service.deleteRole(role.id).subscribe(() => {
          this.message.success('删除成功');
          this.roles = this.roles.filter(r => r.id !== role.id);
          this.selectedRole = null;
          resolve();
        }, () => {
          resolve();
        });
      })
    });
  }

}
