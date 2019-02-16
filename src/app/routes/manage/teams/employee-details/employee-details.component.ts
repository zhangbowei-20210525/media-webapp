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
  NzFormatEmitEvent,
  NzTreeService
} from 'ng-zorro-antd';
import { EmployeeDepartmentComponent } from './components/employee-department.component';
import { TreeService } from '@shared';
import { SettingsService } from '@core';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.less']
})
export class EmployeeDetailsComponent implements OnInit {

  @ViewChild('permissionTree') permissionTreeCom: NzTreeComponent;
  employeeId: number;
  employee: EmployeeDetailsDto;
  isInfoLoading: boolean;
  roles: RoleDto[];
  selectedRole: RoleDto;
  permissionNodes: NzTreeNodeOptions[];
  originCheckedKeys = [];
  finalCheckedKeys = [];
  editMode: boolean;

  constructor(
    private route: ActivatedRoute,
    private settings: SettingsService,
    private service: EmployeeDetailsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private ts: TreeService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.employeeId = +params.get('id');
      this.fetchEmployeeDetails();
      this.fetchSelectionRoles();
      this.fetchPermissions();
    });
  }

  equalsArray(a: any[], b: any[]) {
    return a && b && a.filter(key => !b.includes(key)).length === 0 && b.filter(key => !a.includes(key)).length === 0;
  }

  sliceTagName(tag: string) {
    return tag.length > 20 ? `${tag.slice(0, 20)}...` : tag;
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
      this.permissionNodes = this.getNzTreeNodesByPermissions(permissions);
      this.finalCheckedKeys = this.originCheckedKeys = this.getOwnedPermissionKeys(permissions);
      console.log(this.finalCheckedKeys);
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
        this.permissionNodes = this.getNzTreeNodesByPermissions(permissions);
        this.finalCheckedKeys = this.getOwnedPermissionKeys(permissions);
      }
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

  enterEditMode() {
    this.editMode = true;
    this.ts.setDisableCheckbox(this.permissionTreeCom.getTreeNodes(), false);
  }

  outEditMode() {
    this.editMode = false;
    this.ts.setDisableCheckbox(this.permissionTreeCom.getTreeNodes(), true);
  }

  permissionCheck(event: NzFormatEmitEvent): void {
    this.finalCheckedKeys = event.keys;
    if (event.node.isChecked) {
      this.backCheckNodes(event.node.key);
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
          this.finalCheckedKeys.push(parent.key);
        }
        this.checkParentNodes(parent);
      }
    }
  }

  saveRoleAndPermissions() {
    if (this.validationNodes()) {
      this.service.updateEmployeePermissions(this.employeeId, this.finalCheckedKeys).subscribe(result => {
        this.originCheckedKeys = this.finalCheckedKeys;
        this.message.success('修改成功');
        this.outEditMode();
      }, error => {
        this.message.success('修改失败');
      });
    }
  }

  cancelsaveRoleAndPermissions() {
    this.finalCheckedKeys = this.originCheckedKeys;
    this.ts.setCheckedByKeys(this.permissionTreeCom.getTreeNodes(), this.originCheckedKeys);
    this.outEditMode();
  }

  validationNodes(): boolean {
    const invalid = this.ts.findInvalidNode(this.permissionTreeCom.getTreeNodes());
    if (invalid) {
      this.message.warning(`${invalid.title} 需要前置权限 ${invalid.parentNode.title}`);
      return false;
    }
    return true;
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
