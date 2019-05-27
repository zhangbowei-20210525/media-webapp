import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  content: any;

  constructor(
    public ability: ACLAbility,
    private router: Router,
    private message: NzMessageService,
    private translate: TranslateService,
    private seriesService: SeriesService
  ) { }

  ngOnInit() {
  }

  search() {
    this.router.navigate([this.router.url, { search: this.content }]);
  }
}
