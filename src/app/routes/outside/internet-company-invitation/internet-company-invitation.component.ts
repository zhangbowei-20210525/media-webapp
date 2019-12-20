import { Component, OnInit } from '@angular/core';
import { AuthService, SettingsService } from '@core';
import { InternetCompanyInvitationService } from './internet-company-invitation.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { TreeService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-internet-company-invitation',
  templateUrl: './internet-company-invitation.component.html',
  styleUrls: ['./internet-company-invitation.component.less']
})
export class InternetCompanyInvitationComponent implements OnInit {

  remarks: string;
  token: string;
  icInfo: any;
  bicInfo: any;
  employee_id: number;
  isAuthentication: number;
  companys = [];
  state = false;

  constructor(
    private auth: AuthService,
    private service: InternetCompanyInvitationService,
    private router: Router,
    private route: ActivatedRoute,
    public settings: SettingsService,
    private ts: TreeService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.token = this.auth.token.token;
    if (this.token) {
      this.bicInfo = this.settings.user;
      this.fetchCompanyInfo();
    }
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.employee_id = +params.get('id');
      this.service.getInvitingCompanyInfo(this.employee_id).subscribe(result => {
        this.icInfo = result;
      });
    });
  }

  fetchCompanyInfo() {
    this.service.getCompanys().subscribe(result => {
      this.companys = result;
    });
    this.service.getAuthenticationInfo().subscribe(result => {
      if (result === null) {
        this.isAuthentication = 2;
      } else {
        if (result.status === 0) {
          this.isAuthentication = 0;
        }
        if (result.status === 1) {
          this.isAuthentication = 1;
        }
        if (result.status === 2) {
          this.isAuthentication = 2;
        }
      }
    });
  }

  agree() {
    this.service.agreeInvitation(this.icInfo.company.id, this.icInfo.id, this.remarks).subscribe(result => {
      this.state = true;
    });
  }

  switchCompany(id: number, companyName: string) {
    this.service.switchCompany(id).subscribe(result => {
      console.log(result);
      this.auth.onLogin({
        token: result.token,
        userInfo: result.auth,
        permissions: this.ts.recursionNodesMapArray(result.permissions, p => p.code, p => p.status)
      });
      this.bicInfo = result.auth;
      this.message.success(`已切换到 ${companyName}`);
    });
  }

  login() {
    this.router.navigate([`/passport/login/phone`, { returnUrl: encodeURIComponent(`/outside/ici/${this.employee_id}`) }]);
  }

}
