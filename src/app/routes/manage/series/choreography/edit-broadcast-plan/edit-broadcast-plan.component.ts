import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { moveItemInArray, CdkDragDrop, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import { ChoreographyService } from '../choreography.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-broadcast-plan',
  templateUrl: './edit-broadcast-plan.component.html',
  styleUrls: ['./edit-broadcast-plan.component.less']
})
export class EditBroadcastPlanComponent implements OnInit {

  tabs: any[] = [];
  selectedIndex = 0;

  listOfData = [];
  theatres = [];
  seriesList = [];
  data = [];
  currentBro1 = [];
  currentBro2 = [];
  currentBro3 = [];
  currentBro4 = [];
  currentBro5 = [];

  l1y1 = [];
  l2y1 = [];
  l3y1 = [];
  l4y1 = [];
  l5y1 = [];

  l1y2 = [];
  l2y2 = [];
  l3y2 = [];
  l4y2 = [];
  l5y2 = [];

  // const lms = [
  //   { lm: 'lm1', yp0: { id: 'lm1_yp0', list: [] }, yp1: [], yp2: []},
  //   { lm: 'lm1', yp0: [], yp1: [], yp2: []},
  //   { lm: 'lm1', yp0: [], yp1: [], yp2: []},
  //   { lm: 'lm1', yp0: [], yp1: [], yp2: []}r
  // ]

  constructor(
    private service: ChoreographyService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.service.getSeriesList().subscribe(res => {
      this.seriesList = res.list;
    });
    this.service.getTheatreList().pipe(tap(x => {
      x.forEach(f => {
        f.columns.forEach(fc => {
          fc.program_schedules.forEach(fcp => {
            fcp.broadcast_start_date = fcp.broadcast_start_date.substring(5, 10);
            fcp.broadcast_end_date = fcp.broadcast_end_date.substring(5, 10);
          });
        });
      });
    })).subscribe(res => {
      this.data = res;
      this.theatres = res[0].columns;
      res.forEach(f => {
        this.tabs.push({
          name: f.name,
          content: `Content of tab`
        });
      });
      // for (let i = 0; i < 11; i++) {
      //   this.tabs.push({
      //     name: `Tab ${i}`,
      //     content: `Content of tab ${i}`
      //   });
      // }
      if (this.data[0].columns.length >= 1 && this.data[0].columns[0].program_schedules.length >= 2) {
        this.l1y1.push(this.data[0].columns[0].program_schedules[1]);
      }

      if (this.data[0].columns.length >= 2 && this.data[0].columns[1].program_schedules.length >= 2) {
        this.l2y1.push(this.data[0].columns[1].program_schedules[1]);
      }

      if (this.data[0].columns.length >= 3 && this.data[0].columns[2].program_schedules.length >= 2) {
        this.l3y1.push(this.data[0].columns[2].program_schedules[1]);
      }

      if (this.data[0].columns.length >= 4 && this.data[0].columns[3].program_schedules.length >= 2) {
        this.l4y1.push(this.data[0].columns[3].program_schedules[1]);
      }

      if (this.data[0].columns.length >= 5 && this.data[0].columns[4].program_schedules.length >= 2) {
        this.l5y1.push(this.data[0].columns[4].program_schedules[1]);
      }

      if (this.data[0].columns.length >= 1 && this.data[0].columns[0].program_schedules.length >= 3) {
        this.l1y2.push(this.data[0].columns[0].program_schedules[2]);
      }

      if (this.data[0].columns.length >= 2 && this.data[0].columns[1].program_schedules.length >= 3) {
        this.l2y2.push(this.data[0].columns[1].program_schedules[2]);
      }

      if (this.data[0].columns.length >= 3 && this.data[0].columns[2].program_schedules.length >= 3) {
        this.l3y2.push(this.data[0].columns[2].program_schedules[2]);
      }

      if (this.data[0].columns.length >= 4 && this.data[0].columns[3].program_schedules.length >= 3) {
        this.l4y2.push(this.data[0].columns[3].program_schedules[2]);
      }

      if (this.data[0].columns.length >= 5 && this.data[0].columns[4].program_schedules.length >= 3) {
        this.l5y2.push(this.data[0].columns[4].program_schedules[2]);
      }
    });

  }

  addRow(): void {
    // this.listOfData = [
    //   ...this.listOfData,
    //   {
    //     id: `${this.i}`,
    //     name: `Edward King ${this.i}`,
    //     age: '32',
    //     address: `London, Park Lane no. ${this.i}`
    //   }
    // ];
    // this.i++;
  }

  channelChange(event) {

    this.service.getTheatreList().pipe(tap(x => {
      x.forEach(f => {
        f.columns.forEach(fc => {
          fc.program_schedules.forEach(fcp => {
            fcp.broadcast_start_date = fcp.broadcast_start_date.substring(5, 10);
            fcp.broadcast_end_date = fcp.broadcast_end_date.substring(5, 10);
          });
        });
      });
    })).subscribe(res => {
      this.data = res;
      const channel = this.data.filter(f => {
        return f.name === this.tabs[event.index].name;
      });
      this.theatres = channel[0].columns;
      console.log(this.theatres);
      this.l1y1 = [];
      this.l2y1 = [];
      this.l3y1 = [];
      this.l4y1 = [];
      this.l5y1 = [];
      this.l1y2 = [];
      this.l2y2 = [];
      this.l3y2 = [];
      this.l4y2 = [];
      this.l5y2 = [];
      if (this.theatres.length >= 1 && this.theatres[0].program_schedules.length >= 2) {
        this.l1y1.push(this.theatres[0].program_schedules[1]);
      }

      if (this.theatres.length >= 2 && this.theatres[1].program_schedules.length >= 2) {
        this.l2y1.push(this.theatres[1].program_schedules[1]);
      }

      if (this.theatres.length >= 3 && this.theatres[2].program_schedules.length >= 2) {
        this.l3y1.push(this.theatres[2].program_schedules[1]);
      }

      if (this.theatres.length >= 4 && this.theatres[3].program_schedules.length >= 2) {
        this.l4y1.push(this.theatres[3].program_schedules[1]);
      }

      if (this.theatres.length >= 5 && this.theatres[4].program_schedules.length >= 2) {
        this.l5y1.push(this.theatres[4].program_schedules[1]);
      }

      if (this.theatres.length >= 1 && this.theatres[0].program_schedules.length >= 3) {
        this.l1y2.push(this.theatres[0].program_schedules[2]);
      }

      if (this.theatres.length >= 2 && this.theatres[1].program_schedules.length >= 3) {
        this.l2y2.push(this.theatres[1].program_schedules[2]);
      }

      if (this.theatres.length >= 3 && this.theatres[2].program_schedules.length >= 3) {
        this.l3y2.push(this.theatres[2].program_schedules[2]);
      }

      if (this.theatres.length >= 4 && this.theatres[3].program_schedules.length >= 3) {
        this.l4y2.push(this.theatres[3].program_schedules[2]);
      }

      if (this.theatres.length >= 5 && this.theatres[4].program_schedules.length >= 3) {
        this.l5y2.push(this.theatres[4].program_schedules[2]);
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
      if (event.container.id === 'cdk-drop-list-0') {
        if (this.theatres[0] !== undefined && this.l1y1.length === 0) {
          copyArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          this.service.addTheatreSeries(this.theatres[0].id, event.container.data[0].id).pipe(tap(x => {
            x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
            x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
          })).subscribe(res => {
            this.l1y1 = [];
            this.l1y1.push(res);
          });
        }
      }
      if (event.container.id === 'cdk-drop-list-1') {
        if (this.theatres[1] !== undefined && this.l2y1.length === 0) {
          copyArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          this.service.addTheatreSeries(this.theatres[1].id, event.container.data[0].id).pipe(tap(x => {
            x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
            x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
          })).subscribe(res => {
            this.l2y1 = [];
            this.l2y1.push(res);
          });
        }
      }
      if (event.container.id === 'cdk-drop-list-2') {
        if (this.theatres[2] !== undefined && this.l3y1.length === 0) {
          copyArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          this.service.addTheatreSeries(this.theatres[2].id, event.container.data[0].id).pipe(tap(x => {
            x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
            x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
          })).subscribe(res => {
            this.l3y1 = [];
            this.l3y1.push(res);
          });
        }
      }
      if (event.container.id === 'cdk-drop-list-3') {
        if (this.theatres[3] !== undefined && this.l4y1.length === 0) {
          copyArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          this.service.addTheatreSeries(this.theatres[3].id, event.container.data[0].id).pipe(tap(x => {
            x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
            x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
          })).subscribe(res => {
            this.l4y1 = [];
            this.l4y1.push(res);
          });
        }
      }
      if (event.container.id === 'cdk-drop-list-4') {
        if (this.theatres[4] !== undefined && this.l5y1.length === 0) {
          copyArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
          this.service.addTheatreSeries(this.theatres[4].id, event.container.data[0].id).pipe(tap(x => {
            x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
            x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
          })).subscribe(res => {
            this.l5y1 = [];
            this.l5y1.push(res);
          });
        }
      }
      if (event.container.id === 'cdk-drop-list-5') {
        if (this.l1y1.length > 0) {
          if (this.theatres[0] !== undefined && this.l1y2.length === 0) {
            copyArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
            this.service.addTheatreSeries(this.theatres[0].id, event.container.data[0].id).pipe(tap(x => {
              x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
              x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
            })).subscribe(res => {
              this.l1y2 = [];
              this.l1y2.push(res);
            });
          }
        }
      }
      if (event.container.id === 'cdk-drop-list-6') {
        if (this.l2y1.length > 0) {
          if (this.theatres[1] !== undefined && this.l2y2.length === 0) {
            copyArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
            this.service.addTheatreSeries(this.theatres[1].id, event.container.data[0].id).pipe(tap(x => {
              x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
              x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
            })).subscribe(res => {
              this.l2y2 = [];
              this.l2y2.push(res);
            });
          }
        }
      }
      if (event.container.id === 'cdk-drop-list-7') {
        if (this.l3y1.length > 0) {
          if (this.theatres[2] !== undefined && this.l3y2.length === 0) {
            copyArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
            this.service.addTheatreSeries(this.theatres[2].id, event.container.data[0].id).pipe(tap(x => {
              x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
              x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
            })).subscribe(res => {
              this.l3y2 = [];
              this.l3y2.push(res);
            });
          }
        }
      }
      if (event.container.id === 'cdk-drop-list-8') {
        if (this.l4y1.length > 0) {
          if (this.theatres[3] !== undefined && this.l4y2.length === 0) {
            copyArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
            this.service.addTheatreSeries(this.theatres[3].id, event.container.data[0].id).pipe(tap(x => {
              x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
              x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
            })).subscribe(res => {
              this.l4y2 = [];
              this.l4y2.push(res);
            });
          }
        }
      }
      if (event.container.id === 'cdk-drop-list-9') {
        if (this.l5y1.length > 0) {
          if (this.theatres[4] !== undefined && this.l5y2.length === 0) {
            copyArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
            this.service.addTheatreSeries(this.theatres[4].id, event.container.data[0].id).pipe(tap(x => {
              x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
              x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
            })).subscribe(res => {
              this.l5y2 = [];
              this.l5y2.push(res);
            });
          }
        }
      }
    // }
  }

  isEpisode(episode: any) {
    if (episode === 0 || episode === null) {
      this.message.warning(this.translate.instant('global.please-fill-episodes'));
    }
  }

  evenPredicate() {
    return true;
  }

  noReturnPredicate() {
    return false;
  }

  deleteL1y1() {
    this.service.deleteTheatreSeries(this.l1y1[0].id).subscribe();
    this.l1y1 = [];
  }
  deleteL2y1() {
    this.service.deleteTheatreSeries(this.l2y1[0].id).subscribe();
    this.l2y1 = [];
  }
  deleteL3y1() {
    this.service.deleteTheatreSeries(this.l3y1[0].id).subscribe();
    this.l3y1 = [];
  }
  deleteL4y1() {
    this.service.deleteTheatreSeries(this.l4y1[0].id).subscribe();
    this.l4y1 = [];
  }
  deleteL5y1() {
    this.service.deleteTheatreSeries(this.l5y1[0].id).subscribe();
    this.l5y1 = [];
  }
  deleteL1y2() {
    this.service.deleteTheatreSeries(this.l1y2[0].id).subscribe();
    this.l1y2 = [];
  }
  deleteL2y2() {
    this.service.deleteTheatreSeries(this.l2y2[0].id).subscribe();
    this.l2y2 = [];
  }
  deleteL3y2() {
    this.service.deleteTheatreSeries(this.l3y2[0].id).subscribe();
    this.l3y2 = [];
  }
  deleteL4y2() {
    this.l4y2 = [];
    this.service.deleteTheatreSeries(this.l4y2[0].id).subscribe();
  }
  deleteL5y2() {
    this.service.deleteTheatreSeries(this.l5y2[0].id).subscribe();
    this.l5y2 = [];
  }

}

