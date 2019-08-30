import { Component, OnInit, Input } from '@angular/core';
import { NotifyService } from '../notify/notify.service';

@Component({
  selector: 'app-review-people-message',
  templateUrl: './review-people-message.component.html',
  styleUrls: ['./review-people-message.component.less']
})
export class ReviewPeopleMessageComponent implements OnInit {

  @Input() info: any;
  data: any;


  constructor(
    private service: NotifyService,
  ) { }

  ngOnInit() {
    this.service.getEmployeesInvitedInfo(this.info.related_id).subscribe(result => {
      console.log('123123');
      this.data = result;
      console.log(this.data);
    });
  }

}
