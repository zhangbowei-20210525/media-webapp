import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from './series.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.less']
})
export class SeriesComponent implements OnInit {

  select: string;

  content: any;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private translate: TranslateService,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
  }

  search() {
    this.router.navigate([this.router.url, { search: this.content }]);
  }
}
