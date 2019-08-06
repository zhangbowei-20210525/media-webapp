import { Component, OnInit } from '@angular/core';
import { SeriesService } from 'app/routes/manage/series/series.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core';

@Component({
  selector: 'app-collection-receive',
  templateUrl: './collection-receive.component.html',
  styleUrls: ['./collection-receive.component.less']
})
export class CollectionReceiveComponent implements OnInit {

  id: number;
  solicitationInfo: any;
  constructor(
    private service: SeriesService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    // console.log('234000000000000000');
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      console.log(this.id);
      this.refresh();
    });
  }

  refresh() {
    this.service.getSolicitationDetails(this.id).subscribe(res => {
      console.log(res);
      this.solicitationInfo = res;
    });
  }

  swichUrl() {
    if (this.auth.isLoggedIn) {
      this.router.navigate([`/manage/image/details-solicitation/${this.id}`]);
    } else {
      this.router.navigate([`/passport/login/phone`, { returnUrl: encodeURIComponent(`/manage/image/details-solicitation/${this.id}`) }]);
    }
  }
  toHomePage() {
    if (this.auth.isLoggedIn) {
      this.router.navigate([`manage/dashboard`]);
    } else {
      this.router.navigate([`/passport/login/phone`, { returnUrl: encodeURIComponent(`manage/dashboard`) }]);
    }
  }
}
