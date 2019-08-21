import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChoreographyService } from '../choreography.service';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { keyframes } from '@angular/animations';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {

  listOfData = [];
  events: any;
  noDateTd: number;
  num = 0;
  theatres = [];
  q: any;
  w = [];
  num1 = 1;
  num2 = 0;

  selectedIndex = 0;
  tabs: any[] = [];



  constructor(
    private service: ChoreographyService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.service.getTheatreList().subscribe(res => {
      this.tabs = res;
      this.service.getSpecifiedChannelInfo(this.tabs[0].id).subscribe(s => {
        this.listOfData = this.dataConversion(s.columns);
      });
    });
    // this.service.getChannelInfo().subscribe(res => {
    //   this.listOfData = this.dataConversion(res);
    // });
  }

  onClick(id: number) {
    this.service.getSpecifiedChannelInfo(id).subscribe(res => {
      this.listOfData = this.dataConversion(res.columns);
    });
  }

  dataConversion(list: any[]) {
    const aa = [];
    const info = [];
    list.forEach(t => {
      let index = 0;
      info.push({
        index: index++,
        num1: this.num1++,
        id: t.id,
        theatreName: t.name,
        count: t.broadcast_events.length,
      });
      t.broadcast_events.forEach(c => {
        aa.push({
          lnum: this.num1 - 1,
          index: this.num2++,
          tid: c.column_id,
          broadcast_date: c.broadcast_date,
          episode_index: c.episode_index,
          episode_num: c.episode_num,
          program_name: c.program_name
        });
      });
    });
    this.w = [];
    console.log(info);
    info.forEach(a => {
      this.w.push(a.num1);
    });
    this.q = _.groupBy(aa, g => g.broadcast_date);
    this.q = Object.keys(this.q).map(k => ({ week: k, events: this.q[k] }));
    this.q.forEach(a => {
      a.events = _.groupBy(a.events, g => g.tid + '|' + g.lnum);
    });
    this.q.forEach(a => {
      a.events = Object.keys(a.events).map(k => ({ id: k.substring(k.indexOf('|') + 1, k.length), event: a.events[k] }));
    });
    this.events = this.q;
    return info;
  }
}
