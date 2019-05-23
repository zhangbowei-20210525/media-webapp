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

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.less']
})
export class EmployeeDetailsComponent implements OnInit {

  @ViewChild('permissionTree') permissionTreeCom: NzTreeComponent;

  employeeId: number;
  employee: EmployeeDetailsDto;
  roles: RoleDto[];

  originCheckedKeys: string[];

  isEditable = false;
  isInfoLoading = false;
  selectedRole: RoleDto;
  permissionNodes: NzTreeNodeOptions[];

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
      this.fetchSelectionRoles();
      this.fetchPermissions();
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

  fetchSelectionRoles() {
    this.service.getSelectionRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  fetchPermissions() {
    this.service.getEmployeePermissions(this.employeeId).subscribe(permissions => {
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

  selectRole(role: RoleDto) {
    this.selectedRole = role;
    this.modal.confirm({
      nzTitle: `使用使用 ${role.name} 覆盖当前权限？`,
      nzOnOk: () => {
        this.setEmployeeRole(role.id, true);
      },
      nzOnCancel: () => {
        this.setEmployeeRole(role.id, false);
      }
    });
  }

  setEmployeeRole(role: number, isCover: boolean) {
    this.service.updateEmployeeRole(this.employeeId, role, isCover).subscribe(permissions => {
      if (isCover) {
        // this.setPermissionNodes(permissions);
        this.setOriginCheckedKeysByPermissions(permissions);
        this.setCheckedNodesByKeys(this.originCheckedKeys);
      }
    });
  }

  setEditable(state: boolean, syncOriginChecked = true) {
    this.isEditable = state;
    this.ts.setDisableCheckbox(this.permissionTreeCom.nzNodes, !state);
    if (!state && syncOriginChecked) {
      const nodes = this.permissionTreeCom.getTreeNodes();
      this.ts.recursionNodes(nodes, node => {
        node.isChecked = this.originCheckedKeys.some(k => k === node.key);
        if (node.parentNode) {
          this.syncChecked(node.parentNode);
        }
      });
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
    this.service.updateEmployeePermissions(this.employeeId, permissionKeys).subscribe(() => {
      this.message.success('修改成功');
      this.setEditable(false, false);
      this.settings.permissions = permissionKeys;
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

}
