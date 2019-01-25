import { DepartmentDto } from './dtos';
import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { TeamsService } from './teams.service';
import { SettingsService } from '@core';
import { NzTreeNodeOptions, NzTreeNode, NzTreeComponent, NzFormatEmitEvent, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddDepartmentComponent } from './components/add-department.component';
import { AddCompanyComponent } from './components/add-company.component';
import { dtoMap, dtoCatchError } from '@shared';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.less']
})
export class TeamsComponent implements OnInit {

  @ViewChild('treeCom') treeCom: NzTreeComponent;
  companys: [];
  nodes: NzTreeNodeOptions[];
  activedNode: NzTreeNode;

  constructor(
    public settings: SettingsService,
    private service: TeamsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService
  ) { }

  ngOnInit() {
    this.fetchCompanys();
    this.fetchDepartment();
  }

  get activedNodeKey() {
    return this.activedNode ? this.activedNode.key : '';
  }

  navigateToTeams() {
    this.router.navigateByUrl(`/manage/teams`); // 必须后端存在默认部门
  }

  navigateToEmployees() {
    this.router.navigateByUrl(`/manage/teams/employees/${this.activedNodeKey}`); // 必须后端存在默认部门
  }

  addCompany() {
    this.modal.create({
      nzTitle: '新建企业',
      nzContent: AddCompanyComponent,
      nzWidth: 800,
      nzOnOk: this.addCompanyAgreed
    });
  }

  addCompanyAgreed = (component: AddCompanyComponent) => new Promise((resolve) => {
    if (component.validation()) {
      component.submit()
        .pipe(dtoMap(e => e.data), dtoCatchError())
        .subscribe(result => {
          this.message.success('新建成功');
          this.fetchCompanys();
          resolve();
        }, error => {
          this.message.error('新建失败');
          resolve(false);
        });
    } else {
      resolve(false);
    }
  })

  fetchCompanys() {
    this.service.getCompanys()
      .pipe(dtoMap(e => e.data), dtoCatchError())
      .subscribe(result => {
        this.companys = result;
      });
  }

  switchCompany(id: number, companyName: string) {
    this.service.switchCompany(id)
      .pipe(dtoMap(e => e.data), dtoCatchError())
      .subscribe(result => {
        this.settings.user = result.auth;
        this.token.set({
          token: result.token,
          time: +new Date
        });
        this.fetchDepartment();
        // this.fetchEmployees(this.activedNodeKey);
        // this.navigateToEmployees();
        this.navigateToTeams();
        this.message.success(`已切换到 ${companyName}`);
      });
  }

  fetchDepartment() {
    this.service.getDepartments()
      .pipe(dtoMap(e => e.data), dtoCatchError())
      .subscribe(departments => {
        this.nodes = this.getNodes(departments);
        // const children = this.getNodes(departments);
        // this.nodes = [{
        //   title: this.settings.user.company_full_name,
        //   key: null,
        //   isLeaf: false,
        //   expanded: true,
        //   children: children
        // }];
      });
  }

  getNodes(departments: DepartmentDto[]): NzTreeNodeOptions[] {
    const nodes: NzTreeNodeOptions[] = [];
    for (const key in departments) {
      if (departments.hasOwnProperty(key)) {
        const element = departments[key];
        nodes.push({
          title: element.name,
          key: element.id + '',
          isLeaf: !!element.children && element.children.length < 1,
          expanded: true,
          children: this.getNodes(element.children)
        });
      }
    }
    return nodes;
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
    // this.fetchEmployees(data.node.key);
    this.navigateToEmployees();
  }

  // fetchEmployees(departmentId: any) {
  //   this.isDatasetLoading = true;
  //   this.service.getEmployees(departmentId, '', '')
  //     .pipe(dtoMap(e => e.data), dtoCatchError(), finalize(() => this.isDatasetLoading = false))
  //     .subscribe(result => {
  //       this.dataset = result.list;
  //       this.refreshStatus();
  //     });
  // }

  addDepartment(key: string) {
    this.modal.create({
      nzTitle: '新增部门',
      nzContent: AddDepartmentComponent,
      nzComponentParams: { id: key },
      nzWidth: 800,
      nzOnOk: (component: AddDepartmentComponent) => new Promise((resolve) => {
        if (component.validation()) {
          component.submit()
            .pipe(dtoMap(e => e.data), dtoCatchError())
            .subscribe(result => {
              this.message.success('新增成功');
              const added = this.addNode(
                this.treeCom.getTreeNodes(),
                key,
                {
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

  deleteDepartment(key: string, name: string) {
    this.modal.confirm({
      nzTitle: `是否删除 ${name}`,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.service.deleteDepartment(key)
          .pipe(dtoMap(e => e.data), dtoCatchError())
          .subscribe(result => {
            this.message.success(`已删除 ${name}`);
            const deleted = this.removeNode(this.nodes, key);
            this.nodes = JSON.parse(JSON.stringify(this.nodes));
            resolve();
          }, error => {
            this.message.success(error.message || '删除失败');
            resolve();
          });
      })
    });
  }

  addNode(nodes: NzTreeNode[], parentKey: string, options: NzTreeNodeOptions) {
    let added = false;
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const node = nodes[i];
        if (node.key === parentKey) {
          node.isLeaf = false;
          node.isExpanded = true;
          node.addChildren([options]);
          added = true;
        } else if (node.children.length > 0) {
          added = this.addNode(node.children, parentKey, options);
        }
        if (added) {
          break;
        }
      }
    }
    return added;
  }

  removeNode(nodes: NzTreeNodeOptions[], key: string) {
    let deleted = false;
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const node = nodes[i];
        if (node.key === key) {
          nodes.splice(i as any, 1);
          deleted = true;
        } else if (node.children.length > 0) {
          deleted = this.removeNode(node.children, key);
        }
        if (deleted) {
          break;
        }
      }
    }
    return deleted;
  }

  settingRoles() {

  }

  // refreshStatus(): void {
  //   const allChecked = this.dataset.length > 0 ? this.dataset.every(value => value.checked === true) : false;
  //   const allUnChecked = this.dataset.every(value => !value.checked);
  //   this.allChecked = allChecked;
  //   this.indeterminate = (!allChecked) && (!allUnChecked);
  //   this.disabledButton = !this.dataset.some(value => value.checked);
  // }

  // checkAll(value: boolean): void {
  //   this.dataset.forEach(data => data.checked = value);
  //   this.refreshStatus();
  // }

  // addEmployee() {
  //   this.modal.create({
  //     nzTitle: '新增员工',
  //     nzContent: AddEmployeeComponent,
  //     nzComponentParams: { id: this.activedNode ? this.activedNode.key : '' },
  //     nzWidth: 800,
  //     nzOnOk: (component: AddEmployeeComponent) => new Promise((resolve) => {
  //       if (component.validation()) {
  //         component.submit()
  //           .pipe(dtoMap(e => e.data), dtoCatchError())
  //           .subscribe(result => {
  //             this.message.success('新增成功');
  //             this.fetchEmployees(this.activedNodeKey);
  //             resolve();
  //           }, error => {
  //             this.message.error('新增失败');
  //             resolve(false);
  //           });
  //       } else {
  //         resolve(false);
  //       }
  //     })
  //   });
  // }

  // deleteEmployees() {
  //   this.modal.confirm({
  //     nzTitle: `若员工在多个部门中，则只将员工从该部门中移除`,
  //     nzOnOk: () => new Promise((resolve, reject) => {
  //       this.service.deleteEmployees(this.dataset.filter(value => value.checked).map(value => value.id))
  //         .pipe(dtoMap(e => e.data), dtoCatchError())
  //         .subscribe(result => {
  //           this.message.success('删除成功');
  //           this.fetchEmployees(this.activedNodeKey);
  //           resolve();
  //         }, error => {
  //           reject();
  //         });
  //     })
  //   });
  // }
}
