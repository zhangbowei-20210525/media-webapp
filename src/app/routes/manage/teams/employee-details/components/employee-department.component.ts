import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzTreeComponent, NzTreeNodeOptions, NzFormatEmitEvent } from 'ng-zorro-antd';
import { EmployeeDetailsService } from '../employee-details.service';
import { EmployeeDepartmentDto } from '../dtos';

@Component({
  selector: 'app-employee-department',
  template: `
  <nz-tree #departmentTree [nzData]="departmentNodes" nzCheckable="true" [nzCheckedKeys]="originCheckedKeys"
    (nzCheckBoxChange)="departmentCheck($event)" nzCheckStrictly="true">
  </nz-tree>
  `
})
export class EmployeeDepartmentComponent implements OnInit {

  @Input() id: number;
  @ViewChild('departmentTree') departmentTreeCom: NzTreeComponent;
  departmentNodes: NzTreeNodeOptions[];
  originCheckedKeys = [];
  finalCheckedKeys = [];

  constructor(
    private service: EmployeeDetailsService
  ) { }

  ngOnInit() {
    this.service.getEmployeeDepartments(this.id).subscribe(departments => {
      this.departmentNodes = this.service.getNzTreeNodes(departments);
      this.finalCheckedKeys = this.originCheckedKeys = this.service.getOwnedDepartmentKeys(departments);
    });
  }

  departmentCheck(event: NzFormatEmitEvent): void {
    this.finalCheckedKeys = event.keys;
  }

  submit() {
    return this.service.updateEmployeeDepartments(this.id, this.finalCheckedKeys);
  }

}
