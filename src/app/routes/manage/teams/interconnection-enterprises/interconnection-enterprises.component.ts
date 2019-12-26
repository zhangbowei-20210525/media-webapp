import { finalize } from 'rxjs/operators';
import { NotifyService } from 'app/layout/header/components/notify/notify.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { NzTreeComponent, NzTreeNodeOptions, NzTreeNode, NzModalService, NzMessageService, NzFormatEmitEvent } from 'ng-zorro-antd';
import { CompanyDto, DepartmentDto } from '../dtos';
import { ACLAbility } from '@core/acl';
import { SettingsService } from '@core';
import { TeamsService } from '../teams.service';
import { Router } from '@angular/router';

import { ImportStaffComponent } from '../components/import-staff/import-staff.component';

@Component({
  selector: 'app-interconnection-enterprises',
  templateUrl: './interconnection-enterprises.component.html',
  styleUrls: ['./interconnection-enterprises.component.less']
})
export class InterconnectionEnterprisesComponent implements OnInit {

  hasData2 = false;
  show = 'interconnection';
  has_unprocessed: boolean;
  unauditedList = [];
  yqId: number;
  hasData1 = false;
  internetCompanies = [];
  hlId: number;
  isInterconnection: boolean;
  interconnectionList = [];
  interconnectionJurisdiction: any;
  allChecked: boolean;
  indeterminate: boolean;
  disabledButton = true;

  constructor(
    public ability: ACLAbility,
    public settings: SettingsService,
    private service: TeamsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private notifyService: NotifyService,
  ) { }

  ngOnInit() {
    this.getInterconnectionNotApprovedInfo();
    this.internetCompanyList();
  }

  switchList(val: string) {
    if (val === 'unaudited') {
      this.getInterconnectionNotApprovedInfo();
      this.show = 'unaudited';
    }
    if (val === 'interconnection') {
      this.internetCompanyList();
      this.getInterconnectionNotApprovedInfo();
      this.show = 'interconnection';
    }
  }

  getInterconnectionNotApprovedInfo() {
    this.hasData2 = false;
    this.service.isExamine().subscribe(res => {
      if (res.has_unprocessed === true) {
        this.has_unprocessed = true;
        this.hasData2 = true;
        this.service.getInterconnectionNotApprovedInfo().subscribe(result => {
          this.unauditedList = result.list;
          this.yqId = result.list[0].id;
        });
      }
    });
  }

  internetCompanyList() {
    this.hasData1 = false;
    this.service.getInternetCompanies().subscribe(result => {
      if (result.list.length > 0) {
        this.hasData1 = true;
        this.internetCompanies = result.list;
        this.hlId = result.list[0].id;
        if (result.list[0].status === 'expired') {
          this.isInterconnection = false;
        }
        if (result.list[0].status === 'active') {
          this.isInterconnection = true;
        }
        this.service.getContacts(this.hlId).subscribe(res => {
          this.interconnectionList = res.list;
          this.interconnectionJurisdiction = res.meta;
          console.log(res);
        });
      }
    });
  }

  select(yqId: number) {
    this.yqId = yqId;
  }

  inSelect(hlId: number, isInter: string) {
    this.hlId = hlId;
    if (isInter === 'expired') {
      this.isInterconnection = false;
    }
    if (isInter === 'active') {
      this.isInterconnection = true;
    }
    this.service.getContacts(this.hlId).subscribe(res => {
      this.interconnectionList = res.list;
      this.interconnectionJurisdiction = res.meta;
    });
  }

  deleteInterconnection() {
    this.service.deleteInterconnection(this.hlId).subscribe(result => {
      this.message.success('取消互联成功');
      this.internetCompanyList();
    });
  }

  importStaff() {
    this.modal.create({
      nzTitle: `导入同事进入互联企业`,
      nzContent: ImportStaffComponent,
      nzComponentParams: { hlId: this.hlId },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 600,
      nzOnOk: this.importStaffAgreed,
      nzNoAnimation: true
    });
  }

  importStaffAgreed = (component: ImportStaffComponent) => new Promise((resolve, reject) => {
    component.submit().subscribe(result => {
      this.service.getContacts(this.hlId).subscribe(res => {
        this.interconnectionList = res.list;
        this.interconnectionJurisdiction = res.meta;
        this.message.success('导入成功');
      });
      resolve();
    }, error => {
      reject(false);
    });
  })

  deleteEmployees() {
    this.modal.confirm({
      nzTitle: `确认删除已选中的员工？`,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.service.deleteEmployees(this.interconnectionList.filter(value => value.checked).map(value => value.id))
          .subscribe(result => {
            this.message.success('删除成功');
            this.internetCompanyList();
            resolve();
          }, error => {
            reject(false);
          });
      })
    });
  }

  checkAll(value: boolean): void {
    this.interconnectionList.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.interconnectionList.length > 0 ? this.interconnectionList.every(value => value.checked === true) : false;
    const allUnChecked = this.interconnectionList.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.interconnectionList.some(value => value.checked);
  }

  switchAuthorization(event: any, id: number) {
    this.service.switchAuthorization(id, event).subscribe(result => {
      if (result.code === 0) {
      } else {
        this.message.error(result.message);
        this.internetCompanyList();
      }
    });
  }

}
