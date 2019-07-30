import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { moveItemInArray, CdkDragDrop, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import { ChoreographyService } from '../choreography.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { InsertBroadcastInfoComponent } from '../components/insert-broadcast-info/insert-broadcast-info.component';
import { AddBroadcastingInfoComponent } from '../components/add-broadcasting-info/add-broadcasting-info.component';

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

  l1d1 = [];
  l2d1 = [];
  l3d1 = [];
  l4d1 = [];
  l5d1 = [];

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

  constructor(
    private service: ChoreographyService,
    private message: NzMessageService,
    private translate: TranslateService,
    private modal: NzModalService,
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
        });
      });

      if (this.data[0].columns.length >= 1 && this.data[0].columns[0].program_schedules.length >= 1) {
        this.l1d1.push(this.data[0].columns[0].program_schedules[0]);
      }

      if (this.data[0].columns.length >= 2 && this.data[0].columns[1].program_schedules.length >= 1) {
        this.l2d1.push(this.data[0].columns[1].program_schedules[0]);
      }

      if (this.data[0].columns.length >= 3 && this.data[0].columns[2].program_schedules.length >= 1) {
        this.l3d1.push(this.data[0].columns[2].program_schedules[0]);
      }

      if (this.data[0].columns.length >= 4 && this.data[0].columns[3].program_schedules.length >= 1) {
        this.l4d1.push(this.data[0].columns[3].program_schedules[0]);
      }

      if (this.data[0].columns.length >= 5 && this.data[0].columns[4].program_schedules.length >= 1) {
        this.l5d1.push(this.data[0].columns[4].program_schedules[0]);
      }

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

  channelChange(event) {
    this.selectedIndex = event.index;
    this.l1d1 = [];
    this.l2d1 = [];
    this.l3d1 = [];
    this.l4d1 = [];
    this.l5d1 = [];
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

      if (this.theatres.length >= 1 && this.theatres[0].program_schedules.length >= 1) {
        this.l1d1.push(this.theatres[0].program_schedules[0]);
      }

      if (this.theatres.length >= 2 && this.theatres[1].program_schedules.length >= 1) {
        this.l2d1.push(this.theatres[1].program_schedules[0]);
      }

      if (this.theatres.length >= 3 && this.theatres[2].program_schedules.length >= 1) {
        this.l3d1.push(this.theatres[2].program_schedules[0]);
      }

      if (this.theatres.length >= 4 && this.theatres[3].program_schedules.length >= 1) {
        this.l4d1.push(this.theatres[3].program_schedules[0]);
      }

      if (this.theatres.length >= 5 && this.theatres[4].program_schedules.length >= 1) {
        this.l5d1.push(this.theatres[4].program_schedules[0]);
      }


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

  copySeries(event: CdkDragDrop<any[]>, index: number, arr: any[]) {
    copyArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    this.service.addTheatreSeries('Insert', this.theatres[index].id, event.container.data[0].id).subscribe(res => {
      this.refresh();
    });
  }

  isInsert(event: any, sid: number, tid: number) {
    this.modal.confirm({
      nzTitle: '是否插播信息?',
      nzOkText: '插入',
      nzCancelText: '返回',
      nzOnOk: () => this.insertAgreed(event, sid, tid)
    });
  }

  insertAgreed = (event: any, sid: number, tid: number) => new Promise((resolve) => {
    resolve();
    this.modal.create({
      nzTitle: `插播信息`,
      nzContent: InsertBroadcastInfoComponent,
      nzComponentParams: { data: event.previousContainer.data[event.previousIndex], sid: sid, tid: tid },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addInsertInfoAgreed,
    });
  })

  addInsertInfoAgreed = (component: InsertBroadcastInfoComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      this.l1d1 = [];
      component.submit()
        .subscribe(result => {
          this.message.success('插入信息成功');
          this.refresh();
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  isAddBroadcastingInfo(event: any, tid: number) {
    this.modal.confirm({
      nzTitle: '是否新增当下播出信息?',
      nzOkText: '新增',
      nzCancelText: '返回',
      nzOnOk: () => this.isAddBroadcastingInfoAgreed(event, tid)
    });
  }

  isAddBroadcastingInfoAgreed = (event: any, tid: number) => new Promise((resolve) => {
    resolve();
    this.modal.create({
      nzTitle: `新增当下播出信息`,
      nzContent: AddBroadcastingInfoComponent,
      nzComponentParams: { data: event.previousContainer.data[event.previousIndex], tid: tid },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: (component: AddBroadcastingInfoComponent) => this.addBroadcastingInfoAgreed(event, tid, component)
    });
  })

  addBroadcastingInfoAgreed = (event: any, tid: number, component: AddBroadcastingInfoComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(result => {
          this.message.success(this.translate.instant('global.add-success'));
          this.refresh();
          resolve();
        }, error => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  drop(event: CdkDragDrop<any[]>) {
    switch (event.container.id) {
      case 'l1d1':
        if (this.theatres.length >= 1 && this.l1d1.length >= 0) {
          if (this.l1d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.theatres[0].id);
          }
          if (this.l1d1.length === 1) {
            this.isInsert(event, this.l1d1[0].id, this.theatres[0].id);
          }
        }
        break;
      case 'l2d1':
        if (this.theatres.length >= 2 && this.l2d1.length >= 0) {
          if (this.l2d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.theatres[1].id);
          }
          if (this.l2d1.length === 1) {
            this.isInsert(event, this.l2d1[0].id, this.theatres[1].id);
          }
        }
        break;
      case 'l3d1':
        if (this.theatres.length >= 3 && this.l3d1.length >= 0) {
          if (this.l3d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.theatres[2].id);
          }
          if (this.l3d1.length === 1) {
            this.isInsert(event, this.l3d1[0].id, this.theatres[2].id);
          }
        }
        break;
      case 'l4d1':
        if (this.theatres.length >= 4 && this.l4d1.length >= 0) {
          if (this.l4d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.theatres[3].id);
          }
          if (this.l4d1.length === 1) {
            this.isInsert(event, this.l4d1[0].id, this.theatres[3].id);
          }
        }
        break;
      case 'l5d1':
        if (this.theatres.length >= 5 && this.l5d1.length >= 0) {
          if (this.l5d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.theatres[4].id);
          }
          if (this.l5d1.length === 1) {
            this.isInsert(event, this.l5d1[0].id, this.theatres[4].id);
          }
        }
        break;
      case 'l1y1':
        if (this.theatres.length >= 1 && this.l1y1.length === 0 && this.l1d1.length > 0) {
          console.log('1');
          this.l1y1 = [];
          this.copySeries(event, 0, this.l1y1);
        }
        break;
      case 'l2y1':
        if (this.theatres.length >= 2 && this.l2y1.length === 0 && this.l2d1.length > 0) {
          console.log('2');
          this.l2y1 = [];
          this.copySeries(event, 1, this.l2y1);
        }
        break;
      case 'l3y1':
        if (this.theatres.length >= 3 && this.l3y1.length === 0 && this.l3d1.length > 0) {
          console.log('3');
          this.copySeries(event, 2, this.l3y1);
        }
        break;
      case 'l4y1':
        if (this.theatres.length >= 4 && this.l4y1.length === 0 && this.l4d1.length > 0) {
          console.log('4');
          this.copySeries(event, 3, this.l4y1);
        }
        break;
      case 'l5y1':
        if (this.theatres.length >= 5 && this.l5y1.length === 0 && this.l5d1.length > 0) {
          console.log('5');
          this.copySeries(event, 4, this.l5y1);
        }
        break;
      case 'l1y2':
        if (this.theatres.length >= 1 && this.l1y2.length === 0 && this.l1y1.length > 0) {
          console.log('6');
          this.copySeries(event, 0, this.l1y2);
        }
        break;
      case 'l2y2':
        if (this.theatres.length >= 2 && this.l2y2.length === 0 && this.l2y1.length > 0) {
          console.log('6');
          this.l2y2 = [];
          this.copySeries(event, 1, this.l2y2);
        }
        break;
      case 'l3y2':
        if (this.theatres.length >= 3 && this.l3y2.length === 0 && this.l3y1.length > 0) {
          console.log('6');
          this.l3y2 = [];
          this.copySeries(event, 2, this.l3y2);
        }
        break;
      case 'l4y2':
        if (this.theatres.length >= 4 && this.l4y2.length === 0 && this.l4y1.length > 0) {
          console.log('6');
          this.l4y2 = [];
          this.copySeries(event, 3, this.l4y2);
        }
        break;
      case 'l5y2':
        if (this.theatres.length >= 5 && this.l5y2.length === 0 && this.l5y1.length > 0) {
          console.log('6');
          this.l5y2 = [];
          this.copySeries(event, 4, this.l5y2);
        }
        break;
    }
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

  refresh() {
    this.l1d1 = [];
    this.l2d1 = [];
    this.l3d1 = [];
    this.l4d1 = [];
    this.l5d1 = [];
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
        return f.name === this.tabs[this.selectedIndex].name;
      });
      this.theatres = channel[0].columns;
      if (this.theatres.length >= 1 && this.theatres[0].program_schedules.length >= 1) {
        this.l1d1.push(this.theatres[0].program_schedules[0]);
      }

      if (this.theatres.length >= 2 && this.theatres[1].program_schedules.length >= 1) {
        this.l2d1.push(this.theatres[1].program_schedules[0]);
      }

      if (this.theatres.length >= 3 && this.theatres[2].program_schedules.length >= 1) {
        this.l3d1.push(this.theatres[2].program_schedules[0]);
      }

      if (this.theatres.length >= 4 && this.theatres[3].program_schedules.length >= 1) {
        this.l4d1.push(this.theatres[3].program_schedules[0]);
      }

      if (this.theatres.length >= 5 && this.theatres[4].program_schedules.length >= 1) {
        this.l5d1.push(this.theatres[4].program_schedules[0]);
      }

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

  deleteL1y1() {
    this.service.deleteTheatreSeries(this.l1y1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL2y1() {
    this.service.deleteTheatreSeries(this.l2y1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL3y1() {
    this.service.deleteTheatreSeries(this.l3y1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL4y1() {
    this.service.deleteTheatreSeries(this.l4y1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL5y1() {
    this.service.deleteTheatreSeries(this.l5y1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL1y2() {
    this.service.deleteTheatreSeries(this.l1y2[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL2y2() {
    this.service.deleteTheatreSeries(this.l2y2[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL3y2() {
    this.service.deleteTheatreSeries(this.l3y2[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL4y2() {
    this.service.deleteTheatreSeries(this.l4y2[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL5y2() {
    this.service.deleteTheatreSeries(this.l5y2[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }

  deleteL1d1() {
    this.service.deleteTheatreSeries(this.l1d1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL2d1() {
    this.service.deleteTheatreSeries(this.l2d1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL3d1() {
    this.service.deleteTheatreSeries(this.l3d1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL4d1() {
    this.service.deleteTheatreSeries(this.l4d1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }
  deleteL5d1() {
    this.service.deleteTheatreSeries(this.l5d1[0].id).subscribe(
      res => {
        this.message.success(this.translate.instant('global.delete-successfully'));
        this.refresh();
      }
    );
  }

}

