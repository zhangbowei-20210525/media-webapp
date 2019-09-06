import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChoreographyService } from '../choreography.service';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { keyframes } from '@angular/animations';
import { Util } from '@shared';


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
  date: any;


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
asd = 1;
  r5: number;
  g5: number;
  b5: number;

  a = 0.1;

  selectedIndex = 0;
  tabs: any[] = [];

  list1: any;
  list2: any;
  list3: any;
  list4: any;
  list5: any;
  isRead1 = false;
  isRead2 = false;
  isRead3 = false;
  isRead4 = false;
  isRead5 = false;

  popover1: any;
  popover2: any;
  popover3: any;
  popover4: any;
  popover5: any;
  bb = 1;

  constructor(
    private service: ChoreographyService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    // this.y = new Date().getFullYear();
    // this.m = new Date().getMonth() + 1;
    // this.service.getTheatreList().subscribe(res => {
    //   this.tabs = res;
    //   if (this.tabs.length > 0) {
    //     this.service.getSpecifiedChannelInfo(this.tabs[0].id, this.y, this.m).subscribe(s => {
    //       if (s.columns.length >= 1) {
    //         this.list1 = {
    //           events: s.columns[0].broadcast_events,
    //           name: s.columns[0].name,
    //           time: s.columns[0].broadcast_time,
    //           logo: s.columns[0].name.substring(0, 1),
    //           episode: s.columns[0].program_episode,
    //           r1: this.r1 = Math.floor(Math.random() * 255),
    //           g1: this.g1 = Math.floor(Math.random() * 255),
    //           b1: this.b1 = Math.floor(Math.random() * 255),
    //         };
    //         this.isRead1 = true;
    //       }
    //       if (s.columns.length >= 2) {
    //         this.list2 = {
    //           events: s.columns[1].broadcast_events,
    //           name: s.columns[1].name,
    //           time: s.columns[1].broadcast_time,
    //           logo: s.columns[1].name.substring(0, 1),
    //           episode: s.columns[1].program_episode,
    //           r2: this.r2 = Math.floor(Math.random() * 255),
    //           g2: this.g2 = Math.floor(Math.random() * 255),
    //           b2: this.b2 = Math.floor(Math.random() * 255)
    //         };
    //         this.isRead2 = true;
    //       }
    //       if (s.columns.length >= 3) {
    //         this.list3 = {
    //           events: s.columns[2].broadcast_events,
    //           name: s.columns[2].name,
    //           time: s.columns[2].broadcast_time,
    //           logo: s.columns[2].name.substring(0, 1),
    //           episode: s.columns[2].program_episode,
    //           r3: this.r3 = Math.floor(Math.random() * 255),
    //           g3: this.g3 = Math.floor(Math.random() * 255),
    //           b3: this.b3 = Math.floor(Math.random() * 255)
    //         };
    //         this.isRead3 = true;
    //       }
    //       if (s.columns.length >= 4) {
    //         this.list4 = {
    //           events: s.columns[3].broadcast_events,
    //           name: s.columns[3].name,
    //           time: s.columns[3].broadcast_time,
    //           logo: s.columns[3].name.substring(0, 1),
    //           episode: s.columns[3].program_episode,
    //           r4: this.r4 = Math.floor(Math.random() * 255),
    //           g4: this.g4 = Math.floor(Math.random() * 255),
    //           b4: this.b4 = Math.floor(Math.random() * 255)
    //         };
    //         this.isRead4 = true;
    //       }
    //       if (s.columns.length >= 5) {
    //         this.list5 = {
    //           events: s.columns[4].broadcast_events,
    //           name: s.columns[4].name,
    //           time: s.columns[4].broadcast_time,
    //           logo: s.columns[4].name.substring(0, 1),
    //           episode: s.columns[4].program_episode,
    //           r5: this.r5 = Math.floor(Math.random() * 255),
    //           g5: this.g5 = Math.floor(Math.random() * 255),
    //           b5: this.b5 = Math.floor(Math.random() * 255)
    //         };
    //         this.isRead5 = true;
    //       }
    //     });
    //   }
    // });
  }

  aaa(dd: any) {
    console.log('333344');
    console.log(dd);
  }

  selectChange(select: Date): void {
    // console.log('3344');
    // console.log(select);
    // console.log(select.getFullYear());
    // console.log(select.getMonth() + 1);
  }

  // onClick(id: number) {
  //   this.service.getSpecifiedChannelInfo(id).subscribe(res => {
  //     this.listOfData = this.dataConversion(res.columns);
  //   });
  // }

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
  aa(date: Date) {
    console.log(date);
  }

  isBroadcast1(date: Date) {
    console.log(this.asd++);
    if (this.isRead1 === true) {
      if (this.list1.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = this.list1.events.indexOf(this.list1.events.find(f => Util.dateToString(date) === f.broadcast_date));
        if (a > 0) {
          const n = new Date(this.list1.events[a].broadcast_date).getTime() - 86400000;
          const lastn = this.list1.events[a - 1].broadcast_date;
          const d = new Date(n);
          if (Util.dateToString(d) === lastn) {
            // const arr = [];
            // const oldData = this.list1.events.find(f => lastn === f.broadcast_date);
            // const oldIndex = this.list1.events.indexOf(this.list1.events.find(f => lastn === f.broadcast_date));
            // const data = this.list1.events[oldIndex + 1];
            // arr.push(oldData, data);
            // if (arr[0].program_name === arr[1].program_name) {
            //   return 2;
            // } else {
            //   return 1;
            // }
            return 2;
          } else {
            return 1;
          }
        } else if (a === 0) {
          return 1;
        } else {
          return 0;
        }
      }
      return 0;
    }
  }

  isBroadcast2(date: Date) {
    if (this.isRead2 === true) {
      if (this.list2.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = this.list2.events.indexOf(this.list2.events.find(f => Util.dateToString(date) === f.broadcast_date));
        if (a > 0) {
          const n = new Date(this.list2.events[a].broadcast_date).getTime() - 86400000;
          const lastn = this.list2.events[a - 1].broadcast_date;
          const d = new Date(n);
          if (Util.dateToString(d) === lastn) {
            return 2;
          } else {
            return 1;
          }
        } else if (a === 0) {
          return 1;
        } else {
          return 0;
        }
      }
      return 0;
    }
  }

  isBroadcast3(date: Date) {
    if (this.isRead3 === true) {
      if (this.list3.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = this.list3.events.indexOf(this.list3.events.find(f => Util.dateToString(date) === f.broadcast_date));
        if (a > 0) {
          const n = new Date(this.list3.events[a].broadcast_date).getTime() - 86400000;
          const lastn = this.list3.events[a - 1].broadcast_date;
          const d = new Date(n);
          if (Util.dateToString(d) === lastn) {
            return 2;
          } else {
            return 1;
          }
        } else if (a === 0) {
          return 1;
        } else {
          return 0;
        }
      }
      return 0;
    }
  }

  isBroadcast4(date: Date) {
    if (this.isRead4 === true) {
      if (this.list4.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = this.list4.events.indexOf(this.list4.events.find(f => Util.dateToString(date) === f.broadcast_date));
        if (a > 0) {
          const n = new Date(this.list4.events[a].broadcast_date).getTime() - 86400000;
          const lastn = this.list4.events[a - 1].broadcast_date;
          const d = new Date(n);
          if (Util.dateToString(d) === lastn) {
            return 2;
          } else {
            return 1;
          }
        } else if (a === 0) {
          return 1;
        } else {
          return 0;
        }
      }
      return 0;
    }
  }

  isBroadcast5(date: Date) {
    if (this.isRead5 === true) {
      if (this.list5.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = this.list5.events.indexOf(this.list5.events.find(f => Util.dateToString(date) === f.broadcast_date));
        if (a > 0) {
          const n = new Date(this.list5.events[a].broadcast_date).getTime() - 86400000;
          const lastn = this.list5.events[a - 1].broadcast_date;
          const d = new Date(n);
          if (Util.dateToString(d) === lastn) {
            return 2;
          } else {
            return 1;
          }
        } else if (a === 0) {
          return 1;
        } else {
          return 0;
        }
      }
      return 0;
    }
  }


  queryData1(date: Date) {
    if (this.isRead1 === true) {
      if (this.list1.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = [];
        const b = this.list1.events.find(f => Util.dateToString(date) === f.broadcast_date);
        a.push(b);
        this.popover1 = {
          name: this.list1.name,
          time: this.list1.time,
          events: a,
        };
        return true;
      }
      return false;
    }
  }

  queryData2(date: Date) {
    if (this.isRead2 === true) {
      if (this.list2.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = [];
        const b = this.list2.events.find(f => Util.dateToString(date) === f.broadcast_date);
        a.push(b);
        this.popover2 = {
          name: this.list2.name,
          time: this.list2.time,
          events: a,
        };
        return true;
      }
      return false;
    }
  }

  queryData3(date: Date) {
    if (this.isRead3 === true) {
      if (this.list3.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = [];
        const b = this.list3.events.find(f => Util.dateToString(date) === f.broadcast_date);
        a.push(b);
        this.popover3 = {
          name: this.list3.name,
          time: this.list3.time,
          events: a,
        };
        return true;
      }
      return false;
    }
  }

  queryData4(date: Date) {
    if (this.isRead4 === true) {
      if (this.list4.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = [];
        const b = this.list4.events.find(f => Util.dateToString(date) === f.broadcast_date);
        a.push(b);
        this.popover4 = {
          name: this.list4.name,
          time: this.list4.time,
          events: a,
        };
        return true;
      }
      return false;
    }
  }

  queryData5(date: Date) {
    if (this.isRead5 === true) {
      if (this.list5.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
        const a = [];
        const b = this.list5.events.find(f => Util.dateToString(date) === f.broadcast_date);
        a.push(b);
        this.popover5 = {
          name: this.list5.name,
          time: this.list5.time,
          events: a,
        };
        return true;
      }
      return false;
    }
  }
}
