import { DepartmentDto } from './dtos';
import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { TeamsService } from './teams.service';
import { SettingsService } from '@core';
import { NzTreeNodeOptions, NzTreeNode, NzTreeComponent, NzFormatEmitEvent, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddDepartmentComponent } from './components/add-department.component';
import { AddCompanyComponent } from './components/add-company.component';
import { dtoMap, dtoCatchError } from '@shared';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

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
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService
  ) { }

  ngOnInit() {
    this.fetchCompanys();
    this.fetchDepartment();
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
          this.message.success('新建失败');
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
        this.message.success(`已切换到 ${companyName}`);
      });
  }

  fetchDepartment() {
    this.service.getDepartments()
      .pipe(dtoMap(e => e.data), dtoCatchError())
      .subscribe(departments => {
        const children = this.getNodes(departments);
        this.nodes = [{
          title: this.settings.user.company_full_name,
          key: this.settings.user.company_id + '',
          expanded: true,
          isLeaf: false,
          children: children
        }];
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
  }

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
                  isLeaf: false,
                  expanded: true,
                  children: []
                });
              console.log(added);
              resolve();
            }, error => {
              this.message.success('新增失败');
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
            this.removeNode(this.treeCom.getTreeNodes(), key);
            resolve();
          }, error => {
            reject();
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

  removeNode(nodes: NzTreeNode[], key: string) {
    for (const i in nodes) {
      if (nodes.hasOwnProperty(i)) {
        const node = nodes[i];
        if (node.key === key) {
          // node
        }
      }
    }
  }
}
