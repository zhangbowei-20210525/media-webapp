import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-callback',
  template: `
  <div class="callback-panel">
    <router-outlet></router-outlet>
  </div>
  `,
  styles: [`
  .callback-panel {
    height: 100%;
    width: 100%;
  }
  `]
})
export class CallbackComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
