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
    this.select = 'all';
    this.seriesService.eventEmit.subscribe((value: any) => {
      if (value === 'pubRights') {
          this.select = 'pubRights';
      }
      if (value === 'rights') {
        this.select = 'rights';
    }
   });

  }
  selectList(select: string) {
    if (select === 'all') {
      this.select = 'all';
    }
    if (select === 'publicity') {
      this.select = 'publicity';
    }
    if (select === 'tapes') {
      this.select = 'tapes';
    }
    if (select === 'rights') {
      this.select = 'rights';
    }
  }

  search() {
<<<<<<< HEAD
    if (this.content === undefined) {
      this.message.success(this.translate.instant('global.search'));
    } else {
      if (this.select === 'all') {
        this.router.navigate([`/manage/series/all`, { search: this.content }]);
      }
      if (this.select === 'publicity') {
        this.router.navigate([`/manage/series/publicity`, { search: this.content }]);
      }
      if (this.select === 'tapes') {
        this.router.navigate([`/manage/series/tapes`, { search: this.content }]);
      }
      if (this.select === 'rights') {
        this.router.navigate([`/manage/series/rights`, { search: this.content }]);
      }
=======
    console.log('222');
    console.log(this.select);
    if (this.content === undefined) {
      this.message.success(this.translate.instant('global.search'));
    } else {
    if (this.select === 'all') {
      this.router.navigate([`/manage/series/all`, { search: this.content }]);
    }
    if (this.select === 'publicity') {
      this.router.navigate([`/manage/series/publicity`, { search: this.content }]);
    }
    if (this.select === 'tapes') {
      this.router.navigate([`/manage/series/tapes`, { search: this.content }]);
    }
    if (this.select === 'rights') {
      this.router.navigate([`/manage/series/switchRight/rights`, { search: this.content }]);
    }
    if (this.select === 'pubRights') {
      this.router.navigate([`/manage/series/switchRight/pubRights`, { search: this.content }]);
>>>>>>> 1d1dc2f85bdb39150a59c46833345471720d01cb
    }
  }
}
