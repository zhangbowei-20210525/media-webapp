import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AccountService } from '@shared';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.less']
})
export class EmailComponent implements OnInit {

  constructor(
    private router: Router,
    private accountervice: AccountService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        const token = params.get('token');
        return  this.accountervice.emailActivate(token);
      })
    ).subscribe();
  }

  emailRegister() {
    this.router.navigate([`/manage/series`]);
  }

}
