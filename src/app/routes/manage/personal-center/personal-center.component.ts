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
    private pcs: PersonalCenterService
  ) { }

  ngOnInit() {
    this.pcs.getUserInfo()
      .subscribe(result => {
        this.info = result;
      });
  }

  bindWechat() {

  }

}


