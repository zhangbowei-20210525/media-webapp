import { Component } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationError } from '@angular/router';

declare const NProgress: any;

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'aimedia-webapp';

  constructor(private router: Router) {
    NProgress.configure({ trickleSpeed: 100 });
    router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        NProgress.start();
      } else if (event instanceof RouteConfigLoadEnd) {
        NProgress.done();
      } else if (event instanceof NavigationError) {
        NProgress.done();
      }
    });
  }
}
