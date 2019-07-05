import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { ACLAbility } from '@core/acl';
import { CallUpComponent } from './components/call-up/call-up.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent implements OnInit {
  @ViewChild('publicityOk') publicityOk: any;
  constructor(
    public ability: ACLAbility,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {

  }
  // 发起样片征集令弹框
  callUp() {
    this.modalService.create({
      // nzTitle: `发起审片`,
      nzContent: CallUpComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzCancelText: null,
      nzNoAnimation: true,
      nzOkText: '确定',
      nzOnOk: () => new Promise((resolve) => {
        resolve();
        // this.router.navigate([`/manage/image/details-solicitation`]);
      })
    });
  }

}
