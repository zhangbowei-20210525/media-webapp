import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-switch-right',
  templateUrl: './switch-right.component.html',
  styleUrls: ['./switch-right.component.less']
})
export class SwitchRightComponent implements OnInit {

  switchRight: string;

  constructor() { }

  ngOnInit() {
    console.log(this.switchRight);
  }

}
