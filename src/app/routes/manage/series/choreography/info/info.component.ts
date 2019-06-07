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
  num1 = 0;
  num2 = 0;
  constructor(
    private service: ChoreographyService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.service.getChannelInfo().subscribe(res => {
      this.listOfData = this.dataConversion(res);
    });
  }

  dataConversion(list: any[]) {
    console.log(list);
    const aa = [];
    const info = [];
    list.forEach(a => {
      let index = 0;
      a.columns.forEach(t => {
        info.push({
          index: index++,
          num1: this.num1++,
          id: t.id,
          channelName: a.name,
          theatreName: t.name,
          count: a.columns.length,
          broadcast_events: _.groupBy(t.broadcast_events, g => g.broadcast_date)
        });
        t.broadcast_events.forEach(c => {
          aa.push({
            lnum: this.num1,
            index: this.num2++,
            tid: c.column_id,
            broadcast_date: c.broadcast_date,
            episode_index: c.episode_index,
            episode_num: c.episode_num,
            program_name: c.program_name
          });
        });
      });
    });
    console.log(info);
    this.q = _.groupBy(aa, g => g.broadcast_date);
    this.q = Object.keys(this.q).map(k => ({ week: k, events: this.q[k]}));
    this.q.forEach(a => {
      a.events = _.groupBy(a.events, g => g.tid);
    });
    this.q.forEach(a => {
      a.events = Object.keys(a.events).map(k => ({ id: k, event: a.events[k] }));
    });
    this.events = this.q;
    console.log(this.events);
const as = [];
    list.forEach(a => {
      a.columns.forEach(b => {
        as.push(b.id);
      });
    });
    return info;
  }
}
