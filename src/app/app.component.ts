import { Component } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
// import { NProgress } from 'nprogress';
import NProgress from 'nprogress'

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'aimedia-webapp';

  constructor(private router: Router) {
    console.log(NProgress);
    router.events.subscribe(event => {
      if(event instanceof RouteConfigLoadStart) {
        
        
      } else if(event instanceof RouteConfigLoadEnd) {
        //
      }
    });
  }
}
