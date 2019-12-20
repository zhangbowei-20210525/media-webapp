import { Component, OnInit, Input } from '@angular/core';
import { TeamsService } from '../teams.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-unapproved-invitation-info',
  templateUrl: './unapproved-invitation-info.component.html',
  styleUrls: ['./unapproved-invitation-info.component.less']
})
export class UnapprovedInvitationInfoComponent implements OnInit {

  @Input() unapprovedInfo: any;
  info: any;
  isClick = false;
  isAgree = 0;

  private _yqId: number;

  constructor(
    private service: TeamsService,
    private message: NzMessageService,
  ) { }

  @Input()
  set yqId(val: number) {
    this._yqId = val;
    this.onYqIdChanged(val);
  }

  ngOnInit() {
  }

  onYqIdChanged(val: number) {
    this.info = this.unapprovedInfo.filter(f => val === f.id)[0];
    if (this.info.status === 0) {
      this.isClick = false;
      this.isAgree = 0;
    }
    if (this.info.status === 1) {
      this.isClick = true;
      this.isAgree = 1;
    }
    if (this.info.status === 2) {
      this.isClick = true;
      this.isAgree = 2;
    }
  }

  auditOperation(result: boolean) {
    this.service.auditOperation(this._yqId, result).subscribe(res => {
      this.isClick = true;
    this.unapprovedInfo.forEach(f => {
        if (f.id === this._yqId) {
          if (result === true) {
            this.message.success('关联成功');
            f.status = 1;
            this.isAgree = 1;
          }
          if (result === false) {
            this.message.error('已拒绝');
            f.status = 2;
            this.isAgree = 2;
          }
        }
    });
    });
  }

}
