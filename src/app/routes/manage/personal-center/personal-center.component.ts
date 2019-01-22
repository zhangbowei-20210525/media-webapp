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

  loading = true;
  info: PersonalCenterDto;
  employees: [];

  constructor(
    private pcs: PersonalCenterService,
    private account: AccountService
  ) { }

  ngOnInit() {
    this.pcs.getUserInfo()
      .subscribe(result => {
        this.loading = false;
        this.info = result;
      });

    this.pcs.getUserEmployees()
      .subscribe(result => {
        console.log(result);
        this.employees = result;
      });
  }

  bindPhone() {
    this.account.openBindPhoneModal();
  }

  bindWechat() {
    this.account.openBindWechatModal();
  }

}


