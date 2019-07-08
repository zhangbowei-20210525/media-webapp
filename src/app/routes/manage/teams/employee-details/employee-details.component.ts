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

  originRoles: number[];
  originPermissions: PermissionDto[];
  originCheckedKeys: string[];
  otherCheckedKeys: string[];

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

  // fetchSelectionRoles() {
  //   this.service.getSelectionRoles().subscribe(roles => {
  //     this.roles = roles;
  //   });
  // }

  fetchRoleAndPermissions() {
    zip(this.service.getRoleTemplates(), this.service.getEmployeePermissions(this.employeeId)).subscribe(result => {
      this.roleTemplates = result[0];
      this.originRoles = result[1].role;
      this.originPermissions = result[1].permission_data;
      // this.originCheckedKeys = this.getKeysByPermissions(this.originPermissions);
      this.originCheckedKeys = this.filterRolePermissions(this.getKeysByPermissions(this.originPermissions), this.originRoles);
      // console.log(this.originCheckedKeys);
      this.setRoleOptions(this.originRoles, this.roleTemplates);
      // this.setOriginCheckedKeysByPermissions(this.currentPermissions);
      this.setPermissionNodes(this.originPermissions, this.originRoles, this.originCheckedKeys);
    });
  }

  setPermissionNodes(permissions: PermissionDto[], roles?: number[], checkedKeys?: string[]) {
    this.permissionNodes = this.ts.getNzTreeNodes(permissions, item => ({
      title: item.name,
      key: item.code,
      isLeaf: !!item.children && item.children.length < 1,
      selectable: false,
      expanded: false,
      disableCheckbox: true,
      checked: false // checkedKeys.some(key => key === item.code),
    }));
    if (roles && checkedKeys) {
      setTimeout(() => {
        // console.log(checkedKeys);
        // this.setPermissionsTreeCheckedByKeys(checkedKeys);
        this.setPermissionsTreeChecked(roles, checkedKeys);
      }, 0);
    }
  }

  // setOriginCheckedKeysByPermissions(permissions: PermissionDto[]) {
  //   this.originCheckedKeys = this.ts.recursionNodesMapArray(permissions, p => p.code, p =>
  //     p.status && (!p.children || p.children.length < 1));
  // }

  // setCheckedNodesByKeys(keys: string[]) {
  //   const nodes = this.permissionTreeCom.getTreeNodes();
  //   this.ts.recursionNodes(nodes, node => {
  //     node.isChecked = keys.some(k => k === node.key);
  //     if (node.parentNode) {
  //       this.syncChecked(node.parentNode);
  //     }
  //   });
  // }

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

  // selectRole(role: RoleDto) {
  //   this.selectedRole = role;
  //   this.modal.confirm({
  //     nzTitle: `使用使用 ${role.name} 覆盖当前权限？`,
  //     nzOnOk: () => {
  //       this.setEmployeeRole(role.id, true);
  //     },
  //     nzOnCancel: () => {
  //       this.setEmployeeRole(role.id, false);
  //     }
  //   });
  // }

  // setEmployeeRole(role: number, isCover: boolean) {
  //   this.service.updateEmployeeRole(this.employeeId, role, isCover).subscribe(permissions => {
  //     if (isCover) {
  //       // this.setPermissionNodes(permissions);
  //       this.setOriginCheckedKeysByPermissions(permissions);
  //       this.setCheckedNodesByKeys(this.originCheckedKeys);
  //     }
  //   });
  // }

  setEditable(state: boolean, syncOriginChecked = true) {
    this.isEditable = state;
    this.ts.setDisableCheckbox(this.permissionTreeCom.nzNodes, !state);
    if (!state && syncOriginChecked) {
      // const nodes = this.permissionTreeCom.getTreeNodes();
      // this.ts.recursionNodes(nodes, node => {
      //   node.isChecked = this.originCheckedKeys.some(k => k === node.key);
      //   if (node.parentNode) {
      //     this.syncChecked(node.parentNode);
      //   }
      // });
      this.setPermissionsTreeChecked(this.originRoles, this.originCheckedKeys);
      this.setRoleOptions(this.originRoles, this.roleTemplates);
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
    this.service.updateEmployeePermissions(this.employeeId, permissionKeys, this.roleCheckedkeys).subscribe(permissions => {
      this.message.success('修改成功');
      this.originRoles = this.roleCheckedkeys;
      // this.originCheckedKeys = permissionKeys;
      this.originCheckedKeys = this.filterRolePermissions(permissionKeys, this.originRoles);
      // this.updateRoleCheckedKeys();
      this.setEditable(false, false);
      if (this.employeeId === this.settings.user.employee_id) {
        // this.settings.permissions = this.getKeysByPermissions(permissions); // permissionKeys;
        this.settings.permissions = this.ts.recursionNodesMapArray(permissions, p => p.code, p => p.status);
        // console.log(this.settings.permissions);
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
    const old = this.roleCheckedkeys;
    this.updateRoleCheckedKeys();
    const roleDiff = [..._.difference(old, this.roleCheckedkeys), ..._.difference(this.roleCheckedkeys, old)];
    const currentkey = roleDiff[0];
    const nodes = this.permissionTreeCom.getTreeNodes();
    const currentKeys = this.ts.recursionNodesMapArray(nodes, node => node.key, node => node.isChecked);
    const currentRoleKeys = [...this.originRoles, currentkey];
    const rolePermissionKeys = this.getKeysByPermissions(
      _.flatten(this.roleTemplates.filter(r => currentRoleKeys.includes(r.id)).map(r => r.permissions)));
    const originKeys = [...this.originCheckedKeys, ...rolePermissionKeys];
    const diff = _.difference(currentKeys, originKeys);
    this.setPermissionsTreeChecked(this.roleCheckedkeys, [...this.originCheckedKeys, ...diff]);
  }

  updateRoleCheckedKeys() {
    this.roleCheckedkeys = this.roleCheckOptions.filter(r => r.checked).map(r => r.value);
  }

  setRoleOptions(current: number[], roleTemplates: RoleDto[]) {
    this.roleCheckedkeys = current;
    this.roleCheckOptions = roleTemplates.map(t => ({ label: t.name, value: t.id, checked: this.roleCheckedkeys.includes(t.id) }));
  }

  setPermissionsTreeChecked(roleIds: number[], other: PermissionDto[] | string[]) {
    const keys = new Set([
      ...this.getKeysByPermissions(_.flatten(this.roleTemplates.filter(r => roleIds.includes(r.id)).map(r => r.permissions))),
      ...(_.isString(other[0]) ? other : this.getKeysByPermissions(other as PermissionDto[])) as string[]
    ]);
    this.setPermissionsTreeCheckedByKeys(Array.from(keys));
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

  filterRolePermissions(keys: string[], roleIds: number[]) {
    const rolePermissions = _.flatten(this.roleTemplates.filter(r => roleIds.includes(r.id)).map(r => r.permissions));
    const diff = _.difference(keys, this.getKeysByPermissions(rolePermissions));
    return diff;
  }

  // onEmployeeInvitationPopoverChange(state: boolean) {
  //   if (state) {

  //   }
  // }

}
