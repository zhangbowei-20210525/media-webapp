import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../series/series.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receive-solicitation',
  templateUrl: './receive-solicitation.component.html',
  styleUrls: ['./receive-solicitation.component.less']
})
export class ReceiveSolicitationComponent implements OnInit {

  id: number;
  solicitationInfo: any;

  constructor(
    private service: SeriesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // 取url参数
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.refresh();
    });
  }

  refresh() {
    this.service.getSolicitationDetails(this.id).subscribe(res => {
      console.log(res);
      this.solicitationInfo = res;
    });
  }

}
