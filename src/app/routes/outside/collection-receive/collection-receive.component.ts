import { Component, OnInit } from '@angular/core';
import { SeriesService } from 'app/routes/manage/series/series.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
    console.log('234000000000000000');
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
    this.router.navigate([`/passport/login/phone`, { returnUrl:  encodeURIComponent(`/manage/image/details-solicitation/${this.id}`)}]);
  }

}
