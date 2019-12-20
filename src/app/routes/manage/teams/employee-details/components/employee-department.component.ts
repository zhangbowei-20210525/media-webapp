import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzTreeComponent, NzTreeNodeOptions, NzFormatEmitEvent } from 'ng-zorro-antd';
import { EmployeeDetailsService } from '../employee-details.service';
import { EmployeeDepartmentDto } from '../dtos';
import { TreeService } from '@shared';

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
  departments = [] as EmployeeDepartmentDto[];
  departmentNodes: NzTreeNodeOptions[];
  originCheckedKeys = [];
  finalCheckedKeys = [];

  constructor(
    private service: EmployeeDetailsService,
    private ts: TreeService
  ) { }

  ngOnInit() {
    this.service.getEmployeeDepartments(this.id).subscribe(departments => {
      this.departmentNodes = this.getNzTreeNodesByDepartments(this.departments = departments);
      this.finalCheckedKeys = this.originCheckedKeys = this.getOwnedDepartmentKeys(departments);
    });
  }

  getNzTreeNodesByDepartments(origins: EmployeeDepartmentDto[]): NzTreeNodeOptions[] {
    return this.ts.getNzTreeNodes(origins, item => ({
      title: item.name,
      key: item.id + '',
      isLeaf: !!item.children && item.children.length < 1,
      selectable: false,
      expanded: true,
    }));
  }

  getOwnedDepartmentKeys(origins: EmployeeDepartmentDto[]) {
    return this.ts.getKeysWithStatus(origins, item => item.id + '');
  }

  departmentCheck(event: NzFormatEmitEvent): void {
    this.finalCheckedKeys = event.keys;
  }

  submit() {
    const finalCheckedDepartments = this.ts.recursionNodesMapArray(
      this.departments, item => item, item => this.finalCheckedKeys.includes(item.id + ''));
    return finalCheckedDepartments;
    // return this.service.updateEmployeeDepartments(this.id, this.finalCheckedKeys);
  }

}
