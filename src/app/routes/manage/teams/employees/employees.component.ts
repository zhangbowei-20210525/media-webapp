import { Component, OnInit } from '@angular/core';
import { EmployeesService } from './employees.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ACLAbility } from '@core/acl';
import { EditEmployeeComponent } from '../components/edit-employee.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.less']
})
export class EmployeesComponent implements OnInit {

  department: number;
  allChecked: boolean;
  indeterminate: boolean;
  disabledButton = true;
  isDatasetLoading = false;
  dataset = [];
  invitationData: { qrcode: string, link: string };

  constructor(
    public ability: ACLAbility,
    private service: EmployeesService,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.department = +params.get('id');
      this.refreshDataSet();
    });
  }

  fetchEmployees() {
    this.isDatasetLoading = true;
    this.service.getEmployees(this.department, '', '')
      .pipe(finalize(() => this.isDatasetLoading = false))
      .subscribe(result => {
        this.dataset = result.list;
        this.refreshStatus();
      });
  }

  refreshDataSet() {
    this.fetchEmployees();
  }

  refreshStatus(): void {
    const allChecked = this.dataset.length > 0 ? this.dataset.every(value => value.checked === true) : false;
    const allUnChecked = this.dataset.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataset.some(value => value.checked);
  }

  checkAll(value: boolean): void {
    this.dataset.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  addEmployee() {
    this.service.getRoles().subscribe(roles => {
      this.modal.create({
        nzTitle: '新增员工',
        nzContent: EditEmployeeComponent,
        nzComponentParams: { needRole: true, roleOfOptions:  roles },
        nzOnOk: (component: EditEmployeeComponent) => new Promise((resolve, reject) => {
          if (component.validation()) {
            const value = component.getValue();
            this.service.addEmployee(this.department, value.name, value.phone, value.roles).subscribe(() => {
              this.message.success('新增成功');
              this.refreshDataSet();
              resolve();
            }, () => {
              reject(false);
            });
          } else {
            reject(false);
          }
        })
      });
    });
  }

  deleteEmployees() {
    this.modal.confirm({
      nzTitle: `若员工在多个部门中，则只将员工从该部门中移除`,
      nzOnOk: () => new Promise((resolve, reject) => {
        this.service.deleteEmployees(this.dataset.filter(value => value.checked).map(value => value.id))
          .subscribe(result => {
            this.message.success('删除成功');
            this.refreshDataSet();
            resolve();
          }, error => {
            reject(false);
          });
      })
    });
  }

  onInvitationChange(state: boolean, id: number) {
    if (state) {
      this.service.getEmployeeInvitationData(id).subscribe(result => {
        this.invitationData = {
          qrcode: `data:image/jpeg;base64,${result}`,
          link: `${location.origin}/outside/accept-employee-invitations/${id}`
        };
      });
    } else {
      this.invitationData = null;
    }
  }

}
