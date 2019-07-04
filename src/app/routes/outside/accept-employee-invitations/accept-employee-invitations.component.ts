import { Component, OnInit } from '@angular/core';
import { SeriesService } from 'app/routes/manage/series/series.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accept-employee-invitations',
  templateUrl: './accept-employee-invitations.component.html',
  styleUrls: ['./accept-employee-invitations.component.less']
})
export class AcceptEmployeeInvitationsComponent implements OnInit {

  id: number;
  info: any;
  constructor(
    private service: SeriesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.refresh();
    });
  }

  refresh() {
    this.service.getAcceptEmployeeEnvitationsInfo(this.id).subscribe(res => {
      console.log(res);
      this.info = res;
    });
  }

  swichUrl() {
    this.router.navigate([`/passport/login/phone`,
    { returnUrl:  encodeURIComponent(`/manage/teams`), emp_invitation: this.id }]);
  }

}
