import { AccountService } from '@shared';
import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from './personal-center.service';
import { PersonalCenterDto } from './personal-center.dto';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.less']
})
export class PersonalCenterComponent implements OnInit {

  info: PersonalCenterDto;

  constructor(
    private pcs: PersonalCenterService,
    private account: AccountService
  ) { }

  ngOnInit() {
    // this.pcs.getUserInfo()
    //   .subscribe(result => {
    //     this.info = result;
    //   });
    this.info = {
      username: 'Jing Liu',
      avatar: 'https://vip.bctop.net/static/img/headimage/oG-uI0dPmKgMiFviNJcDIbObBHDk.jpeg'
    } as PersonalCenterDto;
  }

  bindPhone() {
    this.account.openBindPhoneModal();
  }

  bindWechat() {
    this.account.openBindWechatModal();
  }

}


