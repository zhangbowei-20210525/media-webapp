import { AccountService } from '@shared';
import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from './personal-center.service';
import { PersonalCenterDto } from './personal-center.dto';
import { fadeIn } from '@shared/animations';
import { ActivatedRoute, Router } from '@angular/router';


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
  firstSelected = 1;

  constructor(
    private pcs: PersonalCenterService,
    private account: AccountService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.loading = true;
    this.pcs.getUserInfo()
      .subscribe(result => {
        this.loading = false;
        this.info = result;
      console.log(this.info);

      });

    this.pcs.getUserEmployees()
      .subscribe(result => {
        this.employees = result;
      });
      this.router.navigate([`/manage/account-center/history`]);
  }

  bindPhone() {
    this.account.openBindPhoneModal();
  }

  bindWechat() {
    this.account.openBindWechatModal();
  }
  goHistory(data) {
    this.firstSelected = data;
    console.log(data);
  }
  goShare(data) {
    this.firstSelected = data;
    console.log(data);
  }
  goSolicitation(data) {
    this.firstSelected = data;
    console.log(data);
  }

}


