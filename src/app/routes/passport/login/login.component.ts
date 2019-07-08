import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  method: 'phone' | 'wechat';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.url.subscribe(urls => {
      const urlSegments = this.router.url.split('/');
      const lastUrl = urlSegments[urlSegments.length - 1];
      if (lastUrl.startsWith('phone')) {
        this.method = 'phone';
      } else if (lastUrl.startsWith('wechat')) {
        this.method = 'wechat';
      }
    });
  }

}
