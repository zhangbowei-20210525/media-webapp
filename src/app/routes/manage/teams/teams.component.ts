import { finalize } from 'rxjs/operators';
import { DepartmentDto, CompanyDto } from './dtos';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TeamsService } from './teams.service';
import { SettingsService, AuthService } from '@core';
import { NzTreeNodeOptions, NzTreeNode, NzTreeComponent, NzFormatEmitEvent, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddDepartmentComponent } from './components/add-department.component';
import { AddCompanyComponent } from './components/add-company.component';
import { Router, ActivatedRoute } from '@angular/router';
import { EditCompanyComponent } from './components/edit-company.component';
import { TreeService } from '@shared';
import { ACLAbility } from '@core/acl';
import { ACLService } from '@delon/acl';
import { EnterpriseCertificationComponent } from './components/enterprise-certification/enterprise-certification.component';
import { ImportStaffComponent } from './components/import-staff/import-staff.component';
import { NotifyService } from 'app/layout/header/components/notify/notify.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.less']
})
export class TeamsComponent implements OnInit {

  @ViewChild('target') tt: string;

  isCommpanyLoading: boolean;
  currentCompany: CompanyDto;
  companys: CompanyDto[];
  authInfo: any;
  conInfo: any;
  isVisible = false;
  invitationUrl: string;
  invitationQRCode: string;
  typeSwitch = 'departmentManage';

  constructor(
    public ability: ACLAbility,
    public settings: SettingsService,
    private service: TeamsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private ts: TreeService,
    private auth: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.fetchCompany();
    this.fetchCompanys();
    // this.fetchDepartment();
    this.getAuthentication();
    this.getCompanyInfo();
        this.route.firstChild.url.subscribe(url => {
      console.log(url);
      if (url[url.length - 1].path === 'interconnection-enterprises') {
        this.typeSwitch = 'interconnectionEnterprises';
      }
    });
    // this.getInterconnectionNotApprovedInfo();
    // this.internetCompanyList();

    // this.acl.removeAbility([this.ability.company.view]);
    // this.acl.set({ role: ['admin'] });
  }

  switch(string: string) {
    if (string === 'dm') {
      this.typeSwitch = 'departmentManage';
    }
    if (string === 'ie') {
      this.typeSwitch = 'interconnectionEnterprises';
    }
  }

  copyAddress() {
    this.service.getInternetCompanyInvitationUrl().subscribe(result => {
      this.invitationUrl = result.share_url;
      this.invitationQRCode = result.wechat_qrcode;
      this.isVisible = true;
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    const input = document.getElementById('url') as HTMLInputElement;
    input.select();
    document.execCommand('copy');
    this.message.success('复制成功');
  }


  /**
      点击页面入口后，调用次方法，判断是否生成认证弹窗以及提示信息
     */
  authentication(info: any) {
    if (info === null) {
      this.modal.create({
        nzTitle: `企业认证`,
        nzContent: EnterpriseCertificationComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzComponentParams: { info: info, currentCompany: this.conInfo },
        nzWidth: 800,
        nzOkText: '提交',
        nzOnOk: this.addEnterpriseCertificationAgreed,
        nzNoAnimation: true
      });
    } else {

      if (info.status === 0) {
        this.modal.warning({
          nzTitle: '已提交成功，请等待管理员审核！',
          nzContent: '预计1个工作日内审核完毕，审核结果会短信通知到您的注册手机上。'
        });
      }
      if (info.status === 1) {
        this.modal.success({
          nzTitle: '恭喜！认证成功！',
          nzContent: '可以开启华丽的操作之旅啦～'
        });
      }

      if (info.status === 2) {
        this.modal.create({
          nzTitle: this.tt,
          nzContent: EnterpriseCertificationComponent,
          nzComponentParams: { info: info },
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: 800,
          nzOkText: '提交',
          nzOnOk: this.addEnterpriseCertificationAgreed,
          nzNoAnimation: true
        });
      }
    }
  }

  addEnterpriseCertificationAgreed = (component: EnterpriseCertificationComponent) => new Promise((resolve, reject) => {
    if (component.validation() && component.validationFileList()) {
      component.submit()
        .subscribe(result => {
          this.message.success('已提交成功');
          this.getAuthentication();
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  getAuthentication() {
    this.service.getAuthenticationInfo().subscribe(result => {
      this.authInfo = result;
    });
  }
  /**
   * 跳转到团队页面
   */
  navigateToTeams() {
    this.router.navigateByUrl(`/manage/teams`);
    // this.route.firstChild.url.subscribe(url => {
    //   console.log(url);
    //   if (url[url.length - 1].path === 'department-management') {
    //     this.router.navigateByUrl(`/manage/teams/department-management`);
    //   } else if (url[url.length - 1].path === 'interconnection-enterprises') {
    //     this.router.navigateByUrl(`/manage/teams/interconnection-enterprises`);
    //   } else {
    //     throw new Error('Unexpected URL');
    //   }
    // });
  }


  getCompanyInfo() {
    const { company_id, company_name, company_full_name, introduction, is_default_company, phone } = this.settings.user;
    this.currentCompany = { company_id, company_name, company_full_name, introduction, is_default_company, phone };
    this.conInfo = this.settings.user;
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
      this.auth.onLogin({
        token: result.token,
        userInfo: result.auth,
        permissions: this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status)
      });
      this.getCompanyInfo();
      this.getAuthentication();
      this.navigateToTeams();
      // this.fetchDepartment();
      // this.getInterconnectionNotApprovedInfo();
      // this.internetCompanyList();
      this.message.success(`已切换到 ${companyName}`);
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

  // removeNode(nodes: NzTreeNodeOptions[], key: string) {
  //   this.ts.removeNode(nodes, (item, index) => {
  //     return item.key === key;
  //   });
  // }

}
