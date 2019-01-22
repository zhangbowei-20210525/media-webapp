import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TeamsService } from './teams.service';
import { SettingsService } from '@core';
import { NzTreeNodeOptions, NzTreeNode, NzTreeComponent, NzFormatEmitEvent, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddDepartmentComponent } from './components/add-department.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.less']
})
export class TeamsComponent implements OnInit {

  @ViewChild('treeCom') treeCom: NzTreeComponent;
  nodes: NzTreeNodeOptions[];
  activedNode: NzTreeNode;

  constructor(
    private service: TeamsService,
    private settings: SettingsService,
    private modal: NzModalService,
    private message: NzMessageService
    ) { }

  ngOnInit() {
    this.service.getDepartments().subscribe(result => {
      console.log(result);
      this.nodes = [{
        title: this.settings.user.company_full_name,
        key: this.settings.user.company_id + '',
        isLeaf: true
      }];
    });
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
      nzWidth: 800,
      nzOnOk: this.addDepartmentAgreed
    });
  }

  addDepartmentAgreed = (component: AddDepartmentComponent) => new Promise((resolve) => {
    if (component.validation()) {
      component.submit().subscribe(result => {
        this.message.success('新增成功');
        resolve();
      }, error => {
        this.message.success('新增失败');
        resolve(false);
      });
    }
  })

}
