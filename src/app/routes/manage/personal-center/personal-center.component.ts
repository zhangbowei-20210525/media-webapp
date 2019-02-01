import { AccountService } from '@shared';
import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from './personal-center.service';
import { PersonalCenterDto } from './personal-center.dto';
import { fadeIn } from '@shared/animations/fade.animation';

@Component({
  selector: 'app-personal-center',
  templateUrl: './personal-center.component.html',
  styleUrls: ['./personal-center.component.less'],
  animations: [fadeIn]
})
export class PersonalCenterComponent implements OnInit {

  loading: boolean;
  info: PersonalCenterDto;
  employees: [];

  constructor(
    private pcs: PersonalCenterService,
    private account: AccountService
  ) { }

  ngOnInit() {
    this.loading = true;
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


