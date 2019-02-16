import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-copyrights',
  templateUrl: './add-copyrights.component.html',
  styleUrls: ['./add-copyrights.component.less']
})
export class AddCopyrightsComponent implements OnInit {

  tab: number;

  constructor() { }

  ngOnInit() {
  }

  seriesTagChange(event: { checked: boolean, tag: any }) {
    event.tag.status = event.checked;
  }

  next() {
    this.tab = 1;
  }

}
