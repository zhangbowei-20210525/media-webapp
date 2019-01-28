import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeDetailsService } from './employee-details.service';
import { EmployeeDetailsDto, RoleDto } from './dtos';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { EmployeeDepartmentComponent } from './components/employee-department.component';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.less']
})
export class EmployeeDetailsComponent implements OnInit {

  employeeId: number;
  employee: EmployeeDetailsDto;
  isInfoLoading: boolean;
  roles: RoleDto[];
  selectedRole: RoleDto;
  isRolesLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private service: EmployeeDetailsService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.employeeId = +params.get('id');
      this.fetchEmployeeDetails();
      this.fetchSelectionRoles();
    });
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
    this.isRolesLoading = true;
    this.service.getSelectionRoles()
      .pipe(finalize(() => this.isRolesLoading = false))
      .subscribe(roles => {
        this.roles = roles;
      });
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;
    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
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
    this.service.updateEmployeeRole(role.id).subscribe(permissions => {
      // permissions
    });
  }

  saveRoleAndPermissions() {

  }

  cancelsaveRoleAndPermissions() {

  }

}
