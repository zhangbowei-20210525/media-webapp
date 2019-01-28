import { finalize } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RolesService } from './roles.service';
import { dtoMap, dtoCatchError } from '@shared';
import { NzMessageService, NzFormatEmitEvent, NzTreeNodeOptions, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';
import { RoleDto, PermissionDto } from './dtos';

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

  equalsArray(a: [], b: []) {
    return this.service.equalsArrayItems(a, b);
  }

  constructor(
    private service: RolesService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.service.getRoles().subscribe(result => {
      this.roles = result;
    });
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
      this.permissionNodes = this.service.getNzTreeNodes(permissions);
      this.finalCheckedKeys = this.originCheckedKeys = this.service.getOwnedPermissionKeys(permissions);
    });
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
    const node = this.getNodeByKey(this.permissionTreeCom.getTreeNodes(), key);
    if (node) {
      this.checkParentNodes(node);
    }
  }

  getNodeByKey(nodes: NzTreeNode[], key: string): NzTreeNode {
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const element = nodes[i];
        if (element.key === key) {
          return element;
        } else {
          if (element.children && element.children.length > 0) {
            const node = this.getNodeByKey(element.children, key);
            if (node) {
              return node;
            }
          }
        }
      }
    }
    return null;
  }

  checkParentNodes(node: NzTreeNode) {
    const parent = node.getParentNode();
    if (parent) {
      if (!parent.isChecked) {
        parent.setChecked(true);
        if (!this.finalCheckedKeys.find(e => e === parent.key)) {
          this.finalCheckedKeys.push(parent.key);
        }
        this.checkParentNodes(parent);
      }
    }
  }

  validationNodes(): boolean {
    const invalid = this.findInvalidNode(this.permissionTreeCom.getTreeNodes());
    if (invalid) {
      this.message.warning(`${invalid.title} 需要前置权限 ${invalid.parentNode.title}`);
      return false;
    }
    return true;
  }

  findInvalidNode(nodes: NzTreeNode[]): NzTreeNode {
    for (const key in nodes) {
      if (nodes.hasOwnProperty(key)) {
        const element = nodes[key];
        if (element.isChecked) {
          if (element.parentNode) {
            if (!element.parentNode.isChecked) {
              return element;
            }
          }
        }
        if (element.children && element.children.length > 0) {
          const result = this.findInvalidNode(element.children);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

}
