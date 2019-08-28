import { finalize } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeDetailsService } from './employee-details.service';
import { EmployeeDetailsDto, RoleDto, PermissionDto } from './dtos';
import {
  NzModalService,
  NzMessageService,
  NzTreeNodeOptions,
  NzTreeComponent,
  NzTreeNode,
  NzFormatEmitEvent
} from 'ng-zorro-antd';
import { EmployeeDepartmentComponent } from './components/employee-department.component';
import { TreeService } from '@shared';
import { SettingsService } from '@core';
import { ACLAbility } from '@core/acl';
import { ACLService } from '@delon/acl';
import { difference } from 'lodash';
import { zip } from 'rxjs';
import * as _ from 'lodash';
import { EditEmployeeComponent } from '../components/edit-employee.component';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.less']
})
export class EmployeeDetailsComponent implements OnInit {

  @ViewChild('permissionTree') permissionTreeCom: NzTreeComponent;

  employeeId: number;
  employee: EmployeeDetailsDto;
  roleTemplates: RoleDto[];
  // permissionInfo: { role: number[], permission_data: PermissionDto[] };
  // currentRoles: number[];
  // currentPermissions: PermissionDto[];

  originRoles: number[]; // 原始角色
  originPermissions: PermissionDto[]; // 原始权限点
  originCheckedKeys: string[];

  isEditable = false;
  isInfoLoading = false;
  selectedRole: RoleDto;
  permissionNodes: NzTreeNodeOptions[];
  roleCheckedkeys: number[];
  roleCheckOptions: { label: string, value: number, checked: boolean }[];
  employeeInvitationVisible = false;

  constructor(
    public ability: ACLAbility,
    private route: ActivatedRoute,
    private settings: SettingsService,
    private service: EmployeeDetailsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private ts: TreeService,
    private acl: ACLService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.employeeId = +params.get('id');
      this.fetchEmployeeDetails();
      // this.fetchSelectionRoles();
      this.fetchRoleAndPermissions();
    });
    // this.acl.removeAbility([this.ability.company.employee.role]);
  }

  fetchEmployeeDetails() {
    this.isInfoLoading = true;
    this.service.getEmployeeDetails(this.employeeId)
      .pipe(finalize(() => this.isInfoLoading = false))
      .subscribe(result => {
        this.employee = result;
        if (result.role && result.role.length > 0) {
          this.selectedRole = { name: result.role } as RoleDto;
        }
      });
  }

  fetchRoleAndPermissions() {
    zip(this.service.getRoleTemplates(), this.service.getEmployeePermissions(this.employeeId)).subscribe(result => {
      this.roleTemplates = result[0];
      this.originRoles = result[1].role;
      this.originPermissions = result[1].permission_data;
      this.originCheckedKeys = this.getKeysByPermissions(this.originPermissions);
      this.setRoleOptions(this.originRoles, this.roleTemplates);
      this.setPermissionNodes(this.originPermissions, this.originCheckedKeys);
    });
  }

  setPermissionNodes(permissions: PermissionDto[], checkedKeys?: string[]) {
    // 设置权限tree组件
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
      // 此时树还没生成
      setTimeout(() => {
        this.setPermissionsTreeCheckedByKeys(checkedKeys);
      }, 0);
    }
  }

  editEmployee() {
    this.modal.create({
      nzTitle: '编辑员工信息',
      nzContent: EditEmployeeComponent,
      nzComponentParams: { employeeName: this.employee.name, employeePhone: this.employee.phone },
      nzOnOk: (component: EditEmployeeComponent) => new Promise((resolve, reject) => {
        if (component.validation()) {
          const value = component.getValue();
          this.service.editEmployee(this.employeeId, value.name).subscribe(update => {
            // this.employee = update;
            this.employee.name = update.name;
            this.message.success('修改成功');
            resolve();
          }, () => {
            reject(false);
          });
        } else {
          reject(false);
        }
      })
    });
  }

  editDepartments() {
    this.modal.create({
      nzTitle: '修改员工部门',
      nzContent: EmployeeDepartmentComponent,
      nzComponentParams: { id: this.employeeId },
      nzWidth: 800,
      nzOnOk: (component: EmployeeDepartmentComponent) => new Promise((resolve, reject) => {
        if (component.finalCheckedKeys.length > 0) {
          component.submit().subscribe(departments => {
            this.message.success('修改成功');
            this.employee.department = departments;
            resolve();
          }, error => {
            this.message.error('修改失败');
            reject(false);
          });
        } else {
          this.message.warning('至少选择一个部门');
          reject(false);
        }
      })
    });
  }

  setEditable(state: boolean, syncOriginChecked = true) {
    this.isEditable = state;
    this.ts.setDisableCheckbox(this.permissionTreeCom.nzNodes, !state);
    if (!state && syncOriginChecked) {
      this.setPermissionsTreeCheckedByKeys(this.originCheckedKeys);
      this.setRoleOptions(this.originRoles, this.roleTemplates);
    }
  }

  /**
   * 同步选中，通过目标节点状态修正其上下级的全选和半选状态
   * @param node 目标节点
   */
  syncChecked(node: NzTreeNode) {
    const { isChecked, isHalfChecked } = node;
    node.isChecked = node.children.every(n => n.isChecked);
    node.isHalfChecked = node.isChecked ? false : node.children.some(n => n.isChecked || n.isHalfChecked);
    if (node.isChecked === isChecked && node.isHalfChecked === isHalfChecked) {
      return;
    }
    if (node.parentNode) {
      // 从下向上单向传播
      this.syncChecked(node.parentNode);
    }
  }

  savePermissions() {
    const nodes = this.permissionTreeCom.getTreeNodes();
    const permissionKeys = this.ts.recursionNodesMapArray(nodes, node => node.key, node => node.isChecked || node.isHalfChecked);
    this.service.updateEmployeePermissions(this.employeeId, permissionKeys, this.roleCheckedkeys).subscribe(permissions => {
      this.message.success('修改成功');
      this.originRoles = this.roleCheckedkeys;
      this.originCheckedKeys = permissionKeys;
      this.setEditable(false, false);
      if (this.employeeId === this.settings.user.employee_id) {
        this.settings.permissions = this.ts.recursionNodesMapArray(permissions, p => p.code, p => p.status);
      }
    });
  }

  seriesTagChange(event: { checked: boolean, tag: any }) {
    this.service.updateSeriesPermission(this.settings.user.employee_id, event.checked, [event.tag.id])
      .subscribe(result => {
        event.tag.status = event.checked;
      }, error => {
        event.tag.status = !event.checked;
      });
  }

  onRoleCheckChange() {
    const oldRoleCheckedKeys = this.roleCheckedkeys;
    const newRoleCheckedKeys = this.roleCheckedkeys = this.roleCheckOptions.filter(r => r.checked).map(r => r.value);
    if (newRoleCheckedKeys.length > oldRoleCheckedKeys.length) {
      _.difference(newRoleCheckedKeys, oldRoleCheckedKeys) // 也许可能的多个
        .forEach(checked => {
          this.roleChekced(this.roleTemplates.find(r => r.id === checked), oldRoleCheckedKeys);
        });
    } else if (oldRoleCheckedKeys.length > newRoleCheckedKeys.length) {
      _.difference(oldRoleCheckedKeys, newRoleCheckedKeys)
        .forEach(unchecked => {
          this.roleUnchecked(this.roleTemplates.find(r => r.id === unchecked), oldRoleCheckedKeys);
        });
    } else {
      console.log('It\'s amazing.');
    }
  }

  setRoleOptions(current: number[], roleTemplates: RoleDto[]) {
    this.roleCheckedkeys = current;
    this.roleCheckOptions = roleTemplates.map(t => ({ label: t.name, value: t.id, checked: this.roleCheckedkeys.includes(t.id) }));
  }

  setPermissionsTreeCheckedByKeys(keys: string[]) {
    const nodes = this.permissionTreeCom.getTreeNodes();
    this.ts.recursionNodes(nodes, node => {
      node.isChecked = keys.some(k => k === node.key);
      if (node.parentNode) {
        this.syncChecked(node.parentNode);
      }
    });
  }

  getKeysByPermissions(permissions: PermissionDto[]) {
    return this.ts.recursionNodesMapArray(permissions, p => p.code, p => p.status && (!p.children || p.children.length < 1));
  }

  getPermissionKeysFromRole(role: RoleDto | RoleDto[]) {
    const flattened = _.isArray(role) ? _.flatten(role.map(r => r.permissions)) : _.flatten(role.permissions);
    return this.getKeysByPermissions(flattened);
  }

  getCheckedPermissionKeys() {
    return this.ts.recursionNodesMapArray(this.permissionTreeCom.getTreeNodes(), node => node.key, node => node.isChecked);
  }

  roleChekced(role: RoleDto, prevRoleCheckeds: number[]) {
    const rolePermissionKeys = this.getPermissionKeysFromRole(role);
    const otherRolePermissionKeys = this.getPermissionKeysFromRole(this.roleTemplates.filter(r => prevRoleCheckeds.includes(r.id)));
    const roleDiff = _.difference(rolePermissionKeys, otherRolePermissionKeys);
    const currentCheckedPermissionKeys = this.getCheckedPermissionKeys();
    this.setPermissionsTreeCheckedByKeys(_.union(currentCheckedPermissionKeys, roleDiff));
  }

  roleUnchecked(role: RoleDto, prevRoleCheckeds: number[]) {
    const otherRoleCheckedKeys = prevRoleCheckeds.filter(r => r !== role.id);
    const rolePermissionKeys = this.getPermissionKeysFromRole(role);
    const otherRolePermissionKeys = this.getPermissionKeysFromRole(this.roleTemplates.filter(r => otherRoleCheckedKeys.includes(r.id)));
    const intersection = _.intersection(otherRolePermissionKeys, rolePermissionKeys); // [1, 2, 3, 4] [3, 4, 5] => [3, 4]
    const diff = _.difference(rolePermissionKeys, intersection);  // [3, 4, 5] [3, 4] => [5]
    const currentCheckedPermissionKeys = this.getCheckedPermissionKeys();
    const currentDiff = _.difference(currentCheckedPermissionKeys, diff); // [1, 2, 3, 4, 5, 8, 9] => [1, 2, 3, 4, 8, 9]
    this.setPermissionsTreeCheckedByKeys(currentDiff);
  }

}
