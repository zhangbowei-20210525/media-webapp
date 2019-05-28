import { finalize } from 'rxjs/operators';
import { DepartmentDto, CompanyDto } from './dtos';
import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { TeamsService } from './teams.service';
import { SettingsService, AuthService } from '@core';
import { NzTreeNodeOptions, NzTreeNode, NzTreeComponent, NzFormatEmitEvent, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddDepartmentComponent } from './components/add-department.component';
import { AddCompanyComponent } from './components/add-company.component';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';
import { EditCompanyComponent } from './components/edit-company.component';
import { TreeService } from '@shared';
import { ACLAbility } from '@core/acl';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.less']
})
export class TeamsComponent implements OnInit {

  @ViewChild('treeCom') treeCom: NzTreeComponent;
  isCommpanyLoading: boolean;
  currentCompany: CompanyDto;
  companys: CompanyDto[];
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
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getCompanyInfo();
    this.fetchCompany();
    this.fetchCompanys();
    this.fetchDepartment();
    // this.acl.removeAbility([this.ability.company.view]);
    // this.acl.set({ role: ['admin'] });
    // console.log('can', this.ability.company.view, this.acl.can(this.ability.company.view));
    // console.log(this.acl.data);
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

  getCompanyInfo() {
    const { company_id, company_name, company_full_name, introduction, is_default_company } = this.settings.user;
    this.currentCompany = { company_id, company_name, company_full_name, introduction, is_default_company };
  }

  fetchCompany() {
    this.isCommpanyLoading = true;
    this.service.getCurrentCompany().pipe(finalize(() => this.isCommpanyLoading = false)).subscribe(company => {
      this.currentCompany = company;
    });
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
      component.submit().subscribe(result => {
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

  editCompany() {
    this.modal.create({
      nzTitle: '修改企业',
      nzContent: EditCompanyComponent,
      nzComponentParams: {
        name: this.currentCompany.company_name,
        fullName: this.currentCompany.company_full_name,
        introduction: this.currentCompany.introduction
      },
      nzWidth: 800,
      nzOnOk: this.editCompanyAgreed
    });
  }

  editCompanyAgreed = (component: EditCompanyComponent) => new Promise((resolve) => {
    if (component.validation()) {
      component.submit().subscribe(result => {
        this.message.success('编辑成功');
        this.fetchCompany();
        resolve();
      }, error => {
        this.message.error('编辑失败');
        resolve(false);
      });
    } else {
      resolve(false);
    }
  })

  fetchCompanys() {
    this.service.getCompanys().subscribe(result => {
      this.companys = result;
    });
  }

  switchCompany(id: number, companyName: string) {
    this.service.switchCompany(id).subscribe(result => {
      this.auth.login(
        {
          token: result.token,
          time: +new Date,
        },
        result.auth,
        this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status));
      this.getCompanyInfo();
      this.fetchDepartment();
      this.navigateToTeams();
      this.message.success(`已切换到 ${companyName}`);
    });
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

  // addNode(nodes: NzTreeNode[], parentKey: string, options: NzTreeNodeOptions) {
  //   let added = false;
  //   for (const i in nodes) {
  //     if (nodes.hasOwnProperty(i)) {
  //       const node = nodes[i];
  //       if (node.key === parentKey) {
  //         node.isLeaf = false;
  //         node.isExpanded = true;
  //         node.addChildren([options]);
  //         added = true;
  //       } else if (node.children.length > 0) {
  //         added = this.addNode(node.children, parentKey, options);
  //       }
  //       if (added) {
  //         break;
  //       }
  //     }
  //   }
  //   return added;
  // }

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

  // removeNode(nodes: NzTreeNodeOptions[], key: string) {
  //   this.ts.removeNode(nodes, (item, index) => {
  //     return item.key === key;
  //   });
  // }

}
