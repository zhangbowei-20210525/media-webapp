import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChoreographyService } from '../choreography.service';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { keyframes } from '@angular/animations';
import { Util } from '@shared';
import { ChoreographyCalendarPipe } from '@shared/pipes/choreography-calendar.pipe';


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
  y: any;
  m: any;
  date: Date;

  isRead1 = false;
  isRead2 = false;
  isRead3 = false;
  isRead4 = false;
  isRead5 = false;

  r1: number;
  g1: number;
  b1: number;

  r2: number;
  g2: number;
  b2: number;

  r3: number;
  g3: number;
  b3: number;

  r4: number;
  g4: number;
  b4: number;

  r5: number;
  g5: number;
  b5: number;
  data: any;

  a = 0.1;

  selectedIndex = 0;
  tabs: any[] = [];

  list1: any;
  list2: any;
  list3: any;
  list4: any;
  list5: any;

  dayData1: any;
  dayData2: any;
  dayData3: any;
  dayData4: any;
  dayData5: any;
  tabId: number;

  popover: any;

  constructor(
    private service: ChoreographyService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.date = new Date();
    this.y = new Date().getFullYear();
    this.m = new Date().getMonth() + 1;
    this.service.getTheatreList().subscribe(res => {
      this.tabs = res;
      this.tabId = this.tabs[0].id;
      if (this.tabs.length > 0) {
        this.getInfo();
      }
    });
  }



  getInfo() {
    this.isRead1 = false;
    this.isRead2 = false;
    this.isRead3 = false;
    this.isRead4 = false;
    this.isRead5 = false;
    this.service.getSpecifiedChannelInfo(this.tabId, this.y, this.m).subscribe(s => {
      this.data = s;
      if (s.columns.length >= 1) {
        this.list1 = {
          events: s.columns[0].broadcast_events,
          name: s.columns[0].name,
          tid: s.columns[0].id,
          time: s.columns[0].broadcast_time,
          logo: s.columns[0].name.substring(0, 1),
          episode: s.columns[0].program_episode,
          r1: this.r1 = Math.floor(Math.random() * 255),
          g1: this.g1 = Math.floor(Math.random() * 255),
          b1: this.b1 = Math.floor(Math.random() * 255),
        };
        this.isRead1 = true;
      }
      if (s.columns.length >= 2) {
        this.list2 = {
          events: s.columns[1].broadcast_events,
          name: s.columns[1].name,
          tid: s.columns[1].id,
          time: s.columns[1].broadcast_time,
          logo: s.columns[1].name.substring(0, 1),
          episode: s.columns[1].program_episode,
          r2: this.r2 = Math.floor(Math.random() * 255),
          g2: this.g2 = Math.floor(Math.random() * 255),
          b2: this.b2 = Math.floor(Math.random() * 255)
        };
        this.isRead2 = true;
      }
      if (s.columns.length >= 3) {
        this.list3 = {
          events: s.columns[2].broadcast_events,
          name: s.columns[2].name,
          tid: s.columns[2].id,
          time: s.columns[2].broadcast_time,
          logo: s.columns[2].name.substring(0, 1),
          episode: s.columns[2].program_episode,
          r3: this.r3 = Math.floor(Math.random() * 255),
          g3: this.g3 = Math.floor(Math.random() * 255),
          b3: this.b3 = Math.floor(Math.random() * 255)
        };
        this.isRead3 = true;
      }
      if (s.columns.length >= 4) {
        this.list4 = {
          events: s.columns[3].broadcast_events,
          name: s.columns[3].name,
          tid: s.columns[3].id,
          time: s.columns[3].broadcast_time,
          logo: s.columns[3].name.substring(0, 1),
          episode: s.columns[3].program_episode,
          r4: this.r4 = Math.floor(Math.random() * 255),
          g4: this.g4 = Math.floor(Math.random() * 255),
          b4: this.b4 = Math.floor(Math.random() * 255)
        };
        this.isRead4 = true;
      }
      if (s.columns.length >= 5) {
        this.list5 = {
          events: s.columns[4].broadcast_events,
          name: s.columns[4].name,
          tid: s.columns[4].id,
          time: s.columns[4].broadcast_time,
          logo: s.columns[4].name.substring(0, 1),
          episode: s.columns[4].program_episode,
          r5: this.r5 = Math.floor(Math.random() * 255),
          g5: this.g5 = Math.floor(Math.random() * 255),
          b5: this.b5 = Math.floor(Math.random() * 255)
        };
        this.isRead5 = true;
      }
    });
  }

  selectChange(select: Date): void {
    this.y = select.getFullYear();
    this.m = select.getMonth() + 1;
    this.getInfo();
    if (this.isRead1 === true) {
      const data1 = this.list1.events.find(f => Util.dateToString(select) === f.broadcast_date);
      this.dayData1 = [];
      if (data1) {
        this.dayData1.push(data1);
      }
    }
    if (this.isRead2 === true) {
      const data2 = this.list2.events.find(f => Util.dateToString(select) === f.broadcast_date);
      this.dayData2 = [];
      if (data2) {
        this.dayData2.push(data2);
      }
    }
    if (this.isRead3 === true) {
      const data3 = this.list3.events.find(f => Util.dateToString(select) === f.broadcast_date);
      this.dayData3 = [];
      if (data3) {
        this.dayData3.push(data3);
      }
    }
    if (this.isRead4 === true) {
      const data4 = this.list4.events.find(f => Util.dateToString(select) === f.broadcast_date);
      this.dayData4 = [];
      if (data4) {
        this.dayData4.push(data4);
      }
    }
    if (this.isRead5 === true) {
      const data5 = this.list5.events.find(f => Util.dateToString(select) === f.broadcast_date);
      this.dayData5 = [];
      if (data5) {
        this.dayData5.push(data5);
      }
    }
  }

  theatreChange(event, id) {
    if (event === true) {
      this.service.getTheatreDetails(id).subscribe(result => {
        result.program_schedules[0].broadcast_start_date = '正在播出';
        this.popover = {
          name: result.name,
          time: result.broadcast_time,
          series: result.program_schedules,
          weeks: result.weekday_schedules
        };
      });
    }
  }

  onClick(id: number) {
    this.tabId = id;
    this.getInfo();
  }

  // dataConversion(list: any[]) {
  //   const aa = [];
  //   const info = [];
  //   list.forEach(t => {
  //     let index = 0;
  //     info.push({
  //       index: index++,
  //       num1: this.num1++,
  //       id: t.id,
  //       theatreName: t.name,
  //       count: t.broadcast_events.length,
  //     });
  //     t.broadcast_events.forEach(c => {
  //       aa.push({
  //         lnum: this.num1 - 1,
  //         index: this.num2++,
  //         tid: c.column_id,
  //         broadcast_date: c.broadcast_date,
  //         episode_index: c.episode_index,
  //         episode_num: c.episode_num,
  //         program_name: c.program_name
  //       });
  //     });
  //   });
  //   this.w = [];
  //   console.log(info);
  //   info.forEach(a => {
  //     this.w.push(a.num1);
  //   });
  //   this.q = _.groupBy(aa, g => g.broadcast_date);
  //   this.q = Object.keys(this.q).map(k => ({ week: k, events: this.q[k] }));
  //   this.q.forEach(a => {
  //     a.events = _.groupBy(a.events, g => g.tid + '|' + g.lnum);
  //   });
  //   this.q.forEach(a => {
  //     a.events = Object.keys(a.events).map(k => ({ id: k.substring(k.indexOf('|') + 1, k.length), event: a.events[k] }));
  //   });
  //   this.events = this.q;
  //   return info;
  // }
}
