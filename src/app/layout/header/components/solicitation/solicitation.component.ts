import { Component, OnInit, Input } from '@angular/core';
import { NotifyService } from '../notify/notify.service';

@Component({
  selector: 'app-solicitation',
  templateUrl: './solicitation.component.html',
  styleUrls: ['./solicitation.component.less']
})
export class SolicitationComponent implements OnInit {

  @Input() info: any;
  si: any;

  constructor(
    private service: NotifyService,
  ) { }

  ngOnInit() {
    this.service.getSolicitationInfo(this.info.related_id).subscribe(result => {
      this.si = result;
    });
  }

}
