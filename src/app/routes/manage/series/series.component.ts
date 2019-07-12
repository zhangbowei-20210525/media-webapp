import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from './series.service';
import { ACLAbility } from '@core/acl';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.less']
})
export class SeriesComponent implements OnInit {

  select: string;
  searchText: string;
  content: any;

  constructor(
    public ability: ACLAbility,
    private router: Router,
    private message: NzMessageService,
    private translate: TranslateService,
    private seriesService: SeriesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  search() {
    console.log(this.content);
    console.log(this.router.url);
    this.route.url.subscribe(urls => {
      const urlSegments = this.router.url.split(';');
      if (urlSegments.length === 1) {
        this.router.navigate([this.router.url, { search: this.content }]);
      }
      if (urlSegments.length === 2) {
        this.router.navigate([urlSegments[0], { search: this.content }]);
      }
    });
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   this.searchText = params.get('search');
    //   console.log(this.searchText);
    // });
  }
}
