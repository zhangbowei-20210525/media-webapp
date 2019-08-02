import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {

  buttonType1 = 'primary';
  buttonType2 = 'default';
  buttonType3 = 'default';
  buttonType4 = 'default';
  data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];

  constructor() { }

  ngOnInit() {
  }

  importantMessages() {
    this.buttonType1 = 'primary';
    this.buttonType2 = 'default';
    this.buttonType3 = 'default';
    this.buttonType4 = 'default';
  }

  systemMessages() {
    this.buttonType1 = 'default';
    this.buttonType2 = 'primary';
    this.buttonType3 = 'default';
    this.buttonType4 = 'default';
  }

  tapeMessages() {
    this.buttonType1 = 'default';
    this.buttonType2 = 'default';
    this.buttonType3 = 'primary';
    this.buttonType4 = 'default';
  }

  externalMessages() {
    this.buttonType1 = 'default';
    this.buttonType2 = 'default';
    this.buttonType3 = 'default';
    this.buttonType4 = 'primary';
  }

  isReadLogo() {
  }

}
