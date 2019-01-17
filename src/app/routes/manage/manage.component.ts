import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  template: `
  <!-- 左边栏导航 <sidebar-nav></sidebar-nav> -->
  <app-sidebar-nav></app-sidebar-nav>
  <router-outlet></router-outlet>
  `,
})
export class ManageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
