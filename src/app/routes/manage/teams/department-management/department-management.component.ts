import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTreeNodeOptions, NzModalService, NzMessageService, NzTreeComponent, NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { ACLAbility } from '@core/acl';
import { SettingsService } from '@core';
import { TeamsService } from '../teams.service';
import { Router } from '@angular/router';
import { TreeService } from '@shared';
import { ACLService } from '@delon/acl';
import { AuthService } from '@core';
import { NotifyService } from 'app/layout/header/components/notify/notify.service';
import { AddDepartmentComponent } from '../components/add-department.component';
import { DepartmentDto } from '../dtos';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.less']
})
export class DepartmentManagementComponent implements OnInit {

  @ViewChild('treeCom') treeCom: NzTreeComponent;
  nodes: NzTreeNodeOptions[];
  activedNode: NzTreeNode;

  constructor(
    public ability: ACLAbility,
    public settings: SettingsService,
    private service: TeamsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private ts: TreeService,
    private acl: ACLService,
    private auth: AuthService,
    private notifyService: NotifyService,
  ) { }

  ngOnInit() {
    this.fetchDepartment();
  }

  fetchDepartment() {
    this.service.getDepartments().subscribe(departments => {
      this.nodes = this.getNzTreeNodesByDepartments(departments);
    });
  }

  getNzTreeNodesByDepartments(origins: DepartmentDto[]): NzTreeNodeOptions[] {
    return this.ts.getNzTreeNodes(origins, item => ({
      title: item.name,
      key: item.id + '',
      isLeaf: !!item.children && item.children.length < 1,
      expanded: true
    }));
  }

  get activedNodeKey() {
    return this.activedNode ? this.activedNode.key : '';
  }

  activeNode(data: NzFormatEmitEvent) {
    if (this.activedNode) {
      // delete selectedNodeList(u can do anything u want)
      this.treeCom.nzTreeService.setSelectedNodeList(this.activedNode);
    }
    data.node.isSelected = true;
    this.activedNode = data.node;
    // add selectedNodeList
    this.treeCom.nzTreeService.setSelectedNodeList(this.activedNode);
    this.navigateToEmployees();
  }

  addDepartment(key: string) {
    this.modal.create({
      nzTitle: '新增部门',
      nzContent: AddDepartmentComponent,
      nzComponentParams: { id: key },
      nzWidth: 800,
      nzOnOk: (component: AddDepartmentComponent) => new Promise((resolve) => {
        if (component.validation()) {
          component.submit().subscribe(result => {
            this.message.success('新增成功');
            this.addNode(key, {
              title: component.departmentName.value,
              key: result.id,
              isLeaf: true,
              expanded: true,
              children: []
            });
            resolve();
          }, error => {
            this.message.error('新增失败');
            resolve(false);
          });
        } else {
          resolve(false);
        }
      })
    });
  }

  addNode(parentKey: string, options: NzTreeNodeOptions) {
    return this.ts.recursionNodesFindBy(this.treeCom.getTreeNodes(), item => {
      if (item.key === parentKey) {
        item.isLeaf = false;
        item.isExpanded = true;
        item.addChildren([options]);
        return true;
      }
      return false;
    });
  }

  deleteDepartment(key: string, name: string) {
    this.modal.confirm({
      nzTitle: `是否删除 ${name}`,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.service.deleteDepartment(key).subscribe(result => {
          this.message.success(`已删除 ${name}`);
          this.treeCom.getTreeNodeByKey(key).remove();
          // const deleted = this.removeNode(this.nodes, key);
          // console.log(this.nodes);
          // this.nodes = JSON.parse(JSON.stringify(this.nodes));
          resolve();
        }, error => {
          this.message.success(error.message || '删除失败');
          resolve();
        });
      })
    });
  }

  navigateToEmployees() {
    this.router.navigateByUrl(`/manage/teams/department-management/employees/${this.activedNodeKey}`); // 必须后端存在默认部门
  }

}
