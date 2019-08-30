import { Component, OnInit, Input } from '@angular/core';
import { NotifyService } from '../notify/notify.service';

@Component({
  selector: 'app-employees-invited-messages',
  templateUrl: './employees-invited-messages.component.html',
  styleUrls: ['./employees-invited-messages.component.less']
})
export class EmployeesInvitedMessagesComponent implements OnInit {

  @Input() info: any;
  data: any;

  constructor(
    private service: NotifyService,
  ) { }

  ngOnInit() {
    this.service.getEmployeesInvitedInfo(this.info.related_id).subscribe(result => {
      this.data = result;
    });
  }
}
