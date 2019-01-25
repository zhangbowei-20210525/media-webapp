import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RolesService } from './roles.service';
import { dtoMap, dtoCatchError } from '@shared';
import { NzMessageService, NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd';
import { RoleDto, PermissionDto } from './dtos';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.less']
})
export class RolesComponent implements OnInit {

  @ViewChild('inputElement') inputElement: ElementRef;
  @ViewChild('authTreeCom') authTreeCom;
  roles: RoleDto[];
  inputVisible = false;
  inputValue = '';
  permissionNodes: NzTreeNodeOptions[];
  originCheckedKeys = [];
  finalCheckedKeys = [];
  editMode = false;

  constructor(
    private service: RolesService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.service.getRoles()
      .pipe(dtoMap(e => e.data), dtoCatchError())
      .subscribe(result => {
        console.log(result);
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
      console.log(this.roles.findIndex(e => e.name === this.inputValue));
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
    this.service.addRole(name)
      .pipe(dtoMap(e => e.data), dtoCatchError())
      .subscribe(result => {
        const role = this.roles.find(e => e.name === name);
        role.id = result.id;
        result.loading = false;
      }, error => {
        this.roles = this.roles.filter(e => e.name !== name);
      });
  }

  handleRoleChange(name: string) {
    const role = this.roles.find(e => e.name === name);
    this.service.getRolePermissions(role.id)
      .pipe(dtoMap(e => e.data), dtoCatchError())
      .subscribe(permissions => {
        console.log(permissions);
        this.permissionNodes = this.service.getNzTreeNodes(permissions);
        this.originCheckedKeys = this.service.getOwnedPermissionKeys(permissions);
      });
  }

  nzPermissionCheck(event: NzFormatEmitEvent): void {
    console.log(event.checkedKeys);
    this.finalCheckedKeys = event.keys;
  }

  savePermissions() {
    // this.finalCheckedKeys;
  }

  cancelSavePermissions() {

  }

}
