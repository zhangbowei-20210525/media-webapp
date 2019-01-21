import { Component } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

declare const NProgress: any;

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'aimedia-webapp';

  constructor(private router: Router) {
    console.log(NProgress);
    router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        console.log('懒加载开始', event);
        NProgress.start();
      } else if (event instanceof RouteConfigLoadEnd) {
        console.log('懒加载结束', event);
        NProgress.done();
      }
    });
  }
}
