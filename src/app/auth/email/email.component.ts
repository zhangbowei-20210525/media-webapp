import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AccountService, TreeService } from '@shared';
import { switchMap } from 'rxjs/operators';
import { SettingsService } from '@core';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

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
    private settings: SettingsService,
    private ts: TreeService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) { }

  ngOnInit() {
  }
  emailRegister() {
    this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        const token = params.get('token');
        return  this.accountervice.emailActivate(token);
      })
    ).subscribe((result => {
      this.settings.user = result.auth;
      this.settings.permissions = this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status);
      this.tokenService.set({
        token: result.token,
        time: +new Date
      });
      this.router.navigate([`/manage/series`]);
      // window.parent.location.reload();
    }));
  }

}
