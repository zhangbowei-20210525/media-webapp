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

  // @ViewChild('inputElement') inputElement: ElementRef;
  // @ViewChild('permissionTree') permissionTreeCom: NzTreeComponent;
  // roles: RoleDto[];
  // selectedRoleName: string;
  // selectedRole: RoleDto;
  // inputVisible = false;
  // inputValue = '';
  // permissionNodes: NzTreeNodeOptions[];
  // originCheckedKeys = [];
  // currentCheckedKeys = [];

  @ViewChild('permissionTree') permissionTreeCom: NzTreeComponent;

  roles: RoleDto[];

  isLoaded = false;
  editable = false;
  permissionNodes: NzTreeNodeOptions[];

  constructor(
    private service: RolesService,
    private message: NzMessageService,
    private ts: TreeService
  ) { }

  ngOnInit() {
    this.fetchRoles();
  }

  fetchRoles() {
    this.service.getRoles().pipe(finalize(() => this.isLoaded = true)).subscribe(result => {
      this.roles = result;
    });
  }

  onRoleChange(name: string) {
    console.log(name);
  }

  setEditable(state: boolean) {
    this.editable = state;
    this.ts.setDisableCheckbox(this.permissionTreeCom.nzNodes, state);
  }

  saveRoleAndPermissions() {

  }

  // showInput(): void {
  //   this.inputVisible = true;
  //   setTimeout(() => {
  //     this.inputElement.nativeElement.focus();
  //   }, 10);
  // }

  // onRoleChange(): void {
  //   if (this.inputValue) {
  //     if (this.roles.findIndex(e => e.name === this.inputValue) < 0) {
  //       this.addRole(this.inputValue);
  //     } else {
  //       this.message.warning('此角色已存在');
  //     }
  //   }
  //   this.inputValue = '';
  //   this.inputVisible = false;
  // }

  // addRole(name: string) {
  //   this.roles = [...this.roles, {
  //     id: undefined,
  //     name: name,
  //     loading: true
  //   }];
  //   this.service.addRole(name).subscribe(result => {
  //     const role = this.roles.find(e => e.name === name);
  //     role.id = result.id;
  //     role.loading = false;
  //   }, error => {
  //     this.roles = this.roles.filter(e => e.name !== name);
  //   });
  // }

  // handleRoleChange(name: string) {
  //   this.permissionNodes = [];
  //   this.originCheckedKeys = [];
  //   this.currentCheckedKeys = [];
  //   this.selectedRole = this.roles.find(e => e.name === name);
  //   this.service.getRolePermissions(this.selectedRole.id).subscribe(permissions => {
  //     this.permissionNodes = this.getNzTreeNodesByPermissions(permissions);
  //     this.currentCheckedKeys = this.originCheckedKeys = this.getOwnedPermissionKeys(permissions);
  //   });
  // }

  // getNzTreeNodesByPermissions(origins: PermissionDto[]): NzTreeNodeOptions[] {
  //   return this.ts.getNzTreeNodes(origins, item => ({
  //     title: item.name,
  //     key: item.code,
  //     isLeaf: !!item.children && item.children.length < 1,
  //     selectable: false,
  //     expanded: true,
  //     disableCheckbox: false,
  //     checked: item.status
  //   }));
  // }

  // getOwnedPermissionKeys(origins: PermissionDto[]) {
  //   return this.ts.getKeysWithStatus(origins, item => item.code + '');
  // }

  // permissionCheck(event: NzFormatEmitEvent): void {
  //   // this.finalCheckedKeys = event.keys;
  //   // if (event.node.isChecked) {
  //   //   this.backCheckNodes(event.node.key);
  //   // }
  //   const nodes = this.permissionTreeCom.getTreeNodes();
  //   this.finalCheckedKeys = this.ts.recursionNodesMapArray(nodes, node => node.key, node => node.isChecked || node.isHalfChecked);
  //   // console.log(this.finalCheckedKeys);
  // }

  // savePermissions() {
  //   if (this.validationNodes()) {
  //     this.service.updateRolePermissions(this.selectedRole.id, this.finalCheckedKeys).subscribe(result => {
  //       console.log('originCheckedKeys', this.originCheckedKeys);
  //       console.log('finalCheckedKeys', this.finalCheckedKeys);
  //       this.originCheckedKeys = this.finalCheckedKeys;
  //       this.message.success('修改成功');
  //     }, error => {
  //       this.message.success('修改失败');
  //     });
  //   }
  // }

  // cancelSavePermissions() {
  //   this.finalCheckedKeys = this.originCheckedKeys;
  //   this.setCheckedByKeys(this.permissionTreeCom.getTreeNodes(), this.originCheckedKeys);
  // }

  // setCheckedByKeys(nodes: NzTreeNode[], keys: string[]) {
  //   for (const i in nodes) {
  //     if (nodes.hasOwnProperty(i)) {
  //       const element = nodes[i];
  //       element.isChecked = !!keys.find(e => e === element.key);
  //       if (element.children && element.children.length > 0) {
  //         this.setCheckedByKeys(element.children, keys);
  //       }
  //     }
  //   }
  // }

  // backCheckNodes(key: string) {
  //   const node = this.ts.getNodeByKey(this.permissionTreeCom.getTreeNodes(), key);
  //   if (node) {
  //     this.checkParentNodes(node);
  //   }
  // }

  // checkParentNodes(node: NzTreeNode) {
  //   const parent = node.getParentNode();
  //   if (parent) {
  //     if (!parent.isChecked) {
  //       parent.setChecked(true);
  //       if (!this.finalCheckedKeys.find(e => e === parent.key)) {
  //         this.finalCheckedKeys = [...this.finalCheckedKeys, parent.key];
  //       }
  //       this.checkParentNodes(parent);
  //     }
  //   }
  // }

  // validationNodes(): boolean {
  //   // const invalid = this.ts.findInvalidNode(this.permissionTreeCom.getTreeNodes());
  //   const nodes = this.permissionTreeCom.getTreeNodes();
  //   const invalid = this.ts.recursionNodesFindBy(nodes, item =>
  //     (item.isChecked || item.isHalfChecked) && item.parentNode && !(item.parentNode.isChecked || item.parentNode.isHalfChecked));
  //   if (invalid) {
  //     this.message.warning(`${invalid.title} 需要前置权限 ${invalid.parentNode.title}`);
  //     return false;
  //   }
  //   return true;
  // }

}
