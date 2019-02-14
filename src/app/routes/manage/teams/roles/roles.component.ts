import { finalize } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RolesService } from './roles.service';
import { NzMessageService, NzFormatEmitEvent, NzTreeNodeOptions, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';
import { RoleDto, PermissionDto } from './dtos';
import { TreeService } from '@shared';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.less']
})
export class RolesComponent implements OnInit {

  @ViewChild('inputElement') inputElement: ElementRef;
  @ViewChild('permissionTree') permissionTreeCom: NzTreeComponent;
  roles: RoleDto[];
  selectedRole: RoleDto;
  inputVisible = false;
  inputValue = '';
  permissionNodes: NzTreeNodeOptions[];
  originCheckedKeys = [];
  finalCheckedKeys = [];

  constructor(
    private service: RolesService,
    private message: NzMessageService,
    private ts: TreeService
  ) { }

  ngOnInit() {
    this.service.getRoles().subscribe(result => {
      this.roles = result;
    });
  }

  equalsArray(a: [], b: []): boolean {
    return a && b && a.filter(key => !b.includes(key)).length === 0 && b.filter(key => !a.includes(key)).length === 0;
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue) {
      if (this.roles.findIndex(e => e.name === this.inputValue) < 0) {
        this.addRole(this.inputValue);
      } else {
        this.message.warning('此角色已存在');
      }
    }
    this.inputValue = '';
    this.inputVisible = false;
  }

  addRole(name: string) {
    this.roles = [...this.roles, {
      id: undefined,
      name: name,
      loading: true
    }];
    this.service.addRole(name).subscribe(result => {
      const role = this.roles.find(e => e.name === name);
      role.id = result.id;
      role.loading = false;
    }, error => {
      this.roles = this.roles.filter(e => e.name !== name);
    });
  }

  handleRoleChange(name: string) {
    this.permissionNodes = [];
    this.originCheckedKeys = [];
    this.finalCheckedKeys = [];
    this.selectedRole = this.roles.find(e => e.name === name);
    this.service.getRolePermissions(this.selectedRole.id).subscribe(permissions => {
      this.permissionNodes = this.getNzTreeNodesByPermissions(permissions);
      this.finalCheckedKeys = this.originCheckedKeys = this.getOwnedPermissionKeys(permissions);
    });
  }

  getNzTreeNodesByPermissions(origins: PermissionDto[]): NzTreeNodeOptions[] {
    return this.ts.getNzTreeNodes(origins, item => ({
      title: item.name,
      key: item.code,
      isLeaf: !!item.children && item.children.length < 1,
      selectable: false,
      expanded: true,
      disableCheckbox: true,
      checked: item.status
    }));
  }

  getOwnedPermissionKeys(origins: PermissionDto[]) {
    return this.ts.getKeysWithStatus(origins, item => item.code + '');
  }

  permissionCheck(event: NzFormatEmitEvent): void {
    this.finalCheckedKeys = event.keys;
    if (event.node.isChecked) {
      this.backCheckNodes(event.node.key);
    }
  }

  savePermissions() {
    if (this.validationNodes()) {
      this.service.updateRolePermissions(this.selectedRole.id, this.finalCheckedKeys).subscribe(result => {
        this.originCheckedKeys = this.finalCheckedKeys;
        this.message.success('修改成功');
      }, error => {
        this.message.success('修改失败');
      });
    }
  }

  cancelSavePermissions() {
    this.finalCheckedKeys = this.originCheckedKeys;
    this.setCheckedByKeys(this.permissionTreeCom.getTreeNodes(), this.originCheckedKeys);
  }

  setCheckedByKeys(nodes: NzTreeNode[], keys: string[]) {
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const element = nodes[i];
        element.isChecked = !!keys.find(e => e === element.key);
        if (element.children && element.children.length > 0) {
          this.setCheckedByKeys(element.children, keys);
        }
      }
    }
  }

  backCheckNodes(key: string) {
    const node = this.ts.getNodeByKey(this.permissionTreeCom.getTreeNodes(), key);
    if (node) {
      this.checkParentNodes(node);
    }
  }

  checkParentNodes(node: NzTreeNode) {
    const parent = node.getParentNode();
    if (parent) {
      if (!parent.isChecked) {
        parent.setChecked(true);
        if (!this.finalCheckedKeys.find(e => e === parent.key)) {
          this.finalCheckedKeys = [...this.finalCheckedKeys, parent.key];
        }
        this.checkParentNodes(parent);
      }
    }
  }

  validationNodes(): boolean {
    const invalid = this.ts.findInvalidNode(this.permissionTreeCom.getTreeNodes());
    if (invalid) {
      this.message.warning(`${invalid.title} 需要前置权限 ${invalid.parentNode.title}`);
      return false;
    }
    return true;
  }

}
