import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <app-header></app-header>
    <app-entrance></app-entrance>
    <app-main></app-main>
    <app-footer></app-footer>
  `
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
