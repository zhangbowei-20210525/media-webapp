import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { moveItemInArray, CdkDragDrop, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import { ChoreographyService } from '../choreography.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { InsertBroadcastInfoComponent } from '../components/insert-broadcast-info/insert-broadcast-info.component';
import { AddBroadcastingInfoComponent } from '../components/add-broadcasting-info/add-broadcasting-info.component';
import { PaginationDto } from '@shared';

@Component({
  selector: 'app-edit-broadcast-plan',
  templateUrl: './edit-broadcast-plan.component.html',
  styleUrls: ['./edit-broadcast-plan.component.less']
})
export class EditBroadcastPlanComponent implements OnInit {

  tabs: any[] = [];
  seriesList = [];
  data = [];
  currentBro1 = [];
  currentBro2 = [];
  currentBro3 = [];
  currentBro4 = [];
  currentBro5 = [];
  pagination = { page: 1, page_size: 5 } as PaginationDto;

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
  channelId: number;

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
    this.service.getAllChannel().subscribe(res => {
      this.tabs = res.list;
      if (this.tabs.length > 0) {
        this.channelId = this.tabs[0].id;
        this.service.getChannelDetails(this.channelId, this.pagination).pipe(tap(x => {
          x.list.forEach(f => {
            f.program_schedules.forEach(fcp => {
              fcp.broadcast_start_date = fcp.broadcast_start_date.substring(5, 10);
              fcp.broadcast_end_date = fcp.broadcast_end_date.substring(5, 10);
            });
          });
        })).subscribe(result => {
          this.data = result.list;
          this.pagination = result.pagination;
          if (this.data.length >= 1 && this.data[0].program_schedules.length >= 1) {
            this.l1d1.push(this.data[0].program_schedules[0]);
          }

          if (this.data.length >= 2 && this.data[1].program_schedules.length >= 1) {
            this.l2d1.push(this.data[1].program_schedules[0]);
          }

          if (this.data.length >= 3 && this.data[2].program_schedules.length >= 1) {
            this.l3d1.push(this.data[2].program_schedules[0]);
          }

          if (this.data.length >= 4 && this.data[3].program_schedules.length >= 1) {
            this.l4d1.push(this.data[3].program_schedules[0]);
          }

          if (this.data.length >= 5 && this.data[4].program_schedules.length >= 1) {
            this.l5d1.push(this.data[4].program_schedules[0]);
          }

          if (this.data.length >= 1 && this.data[0].program_schedules.length >= 2) {
            this.l1y1.push(this.data[0].program_schedules[1]);
          }

          if (this.data.length >= 2 && this.data[1].program_schedules.length >= 2) {
            this.l2y1.push(this.data[1].program_schedules[1]);
          }

          if (this.data.length >= 3 && this.data[2].program_schedules.length >= 2) {
            this.l3y1.push(this.data[2].program_schedules[1]);
          }

          if (this.data.length >= 4 && this.data[3].program_schedules.length >= 2) {
            this.l4y1.push(this.data[3].program_schedules[1]);
          }

          if (this.data.length >= 5 && this.data[4].program_schedules.length >= 2) {
            this.l5y1.push(this.data[4].program_schedules[1]);
          }

          if (this.data.length >= 1 && this.data[0].program_schedules.length >= 3) {
            this.l1y2.push(this.data[0].program_schedules[2]);
          }

          if (this.data.length >= 2 && this.data[1].program_schedules.length >= 3) {
            this.l2y2.push(this.data[1].program_schedules[2]);
          }

          if (this.data.length >= 3 && this.data[2].program_schedules.length >= 3) {
            this.l3y2.push(this.data[2].program_schedules[2]);
          }

          if (this.data.length >= 4 && this.data[3].program_schedules.length >= 3) {
            this.l4y2.push(this.data[3].program_schedules[2]);
          }

          if (this.data.length >= 5 && this.data[4].program_schedules.length >= 3) {
            this.l5y2.push(this.data[4].program_schedules[2]);
          }
        });
      }
    });
  }

  pageChange(page: number) {
    console.log(page);
    this.pagination.page = page;
    this.refresh();
  }

  channelChange(id: number) {
    this.channelId = id;
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
    this.service.getChannelDetails(this.channelId, this.pagination).pipe(tap(x => {
      x.list.forEach(f => {
        f.program_schedules.forEach(fcp => {
          fcp.broadcast_start_date = fcp.broadcast_start_date.substring(5, 10);
          fcp.broadcast_end_date = fcp.broadcast_end_date.substring(5, 10);
        });
      });
    })).subscribe(res => {
      this.data = res.list;
      this.pagination = res.pagination;

      if (this.data.length >= 1 && this.data[0].program_schedules.length >= 1) {
        this.l1d1.push(this.data[0].program_schedules[0]);
      }

      if (this.data.length >= 2 && this.data[1].program_schedules.length >= 1) {
        this.l2d1.push(this.data[1].program_schedules[0]);
      }

      if (this.data.length >= 3 && this.data[2].program_schedules.length >= 1) {
        this.l3d1.push(this.data[2].program_schedules[0]);
      }

      if (this.data.length >= 4 && this.data[3].program_schedules.length >= 1) {
        this.l4d1.push(this.data[3].program_schedules[0]);
      }

      if (this.data.length >= 5 && this.data[4].program_schedules.length >= 1) {
        this.l5d1.push(this.data[4].program_schedules[0]);
      }


      if (this.data.length >= 1 && this.data[0].program_schedules.length >= 2) {
        this.l1y1.push(this.data[0].program_schedules[1]);
      }

      if (this.data.length >= 2 && this.data[1].program_schedules.length >= 2) {
        this.l2y1.push(this.data[1].program_schedules[1]);
      }

      if (this.data.length >= 3 && this.data[2].program_schedules.length >= 2) {
        this.l3y1.push(this.data[2].program_schedules[1]);
      }

      if (this.data.length >= 4 && this.data[3].program_schedules.length >= 2) {
        this.l4y1.push(this.data[3].program_schedules[1]);
      }

      if (this.data.length >= 5 && this.data[4].program_schedules.length >= 2) {
        this.l5y1.push(this.data[4].program_schedules[1]);
      }

      if (this.data.length >= 1 && this.data[0].program_schedules.length >= 3) {
        this.l1y2.push(this.data[0].program_schedules[2]);
      }

      if (this.data.length >= 2 && this.data[1].program_schedules.length >= 3) {
        this.l2y2.push(this.data[1].program_schedules[2]);
      }

      if (this.data.length >= 3 && this.data[2].program_schedules.length >= 3) {
        this.l3y2.push(this.data[2].program_schedules[2]);
      }

      if (this.data.length >= 4 && this.data[3].program_schedules.length >= 3) {
        this.l4y2.push(this.data[3].program_schedules[2]);
      }

      if (this.data.length >= 5 && this.data[4].program_schedules.length >= 3) {
        this.l5y2.push(this.data[4].program_schedules[2]);
      }
    });
  }

  copySeries(event: CdkDragDrop<any[]>, index: number, arr: any[]) {
    copyArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    this.service.addTheatreSeries('Insert', this.data[index].id, event.container.data[0].id).subscribe(res => {
      this.refresh();
    });
  }

  isInsert(event: any, sid: number, tid: number) {
    this.modal.confirm({
      nzTitle: '???????????????????',
      nzOkText: '??????',
      nzCancelText: '??????',
      nzOnOk: () => this.insertAgreed(event, sid, tid)
    });
  }

  insertAgreed = (event: any, sid: number, tid: number) => new Promise((resolve) => {
    resolve();
    this.modal.create({
      nzTitle: `????????????`,
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
          this.message.success('??????????????????');
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
      nzTitle: '???????????????????????????????',
      nzOkText: '??????',
      nzCancelText: '??????',
      nzOnOk: () => this.isAddBroadcastingInfoAgreed(event, tid)
    });
  }

  isAddBroadcastingInfoAgreed = (event: any, tid: number) => new Promise((resolve) => {
    resolve();
    this.modal.create({
      nzTitle: `????????????????????????`,
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
        if (this.data.length >= 1 && this.l1d1.length >= 0) {
          if (this.l1d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.data[0].id);
          }
          if (this.l1d1.length === 1) {
            this.isInsert(event, this.l1d1[0].id, this.data[0].id);
          }
        }
        break;
      case 'l2d1':
        if (this.data.length >= 2 && this.l2d1.length >= 0) {
          if (this.l2d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.data[1].id);
          }
          if (this.l2d1.length === 1) {
            this.isInsert(event, this.l2d1[0].id, this.data[1].id);
          }
        }
        break;
      case 'l3d1':
        if (this.data.length >= 3 && this.l3d1.length >= 0) {
          if (this.l3d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.data[2].id);
          }
          if (this.l3d1.length === 1) {
            this.isInsert(event, this.l3d1[0].id, this.data[2].id);
          }
        }
        break;
      case 'l4d1':
        if (this.data.length >= 4 && this.l4d1.length >= 0) {
          if (this.l4d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.data[3].id);
          }
          if (this.l4d1.length === 1) {
            this.isInsert(event, this.l4d1[0].id, this.data[3].id);
          }
        }
        break;
      case 'l5d1':
        if (this.data.length >= 5 && this.l5d1.length >= 0) {
          if (this.l5d1.length === 0) {
            this.isAddBroadcastingInfo(event, this.data[4].id);
          }
          if (this.l5d1.length === 1) {
            this.isInsert(event, this.l5d1[0].id, this.data[4].id);
          }
        }
        break;
      case 'l1y1':
        if (this.data.length >= 1 && this.l1y1.length === 0 && this.l1d1.length > 0) {
          console.log('1');
          this.l1y1 = [];
          this.copySeries(event, 0, this.l1y1);
        }
        break;
      case 'l2y1':
        if (this.data.length >= 2 && this.l2y1.length === 0 && this.l2d1.length > 0) {
          console.log('2');
          this.l2y1 = [];
          this.copySeries(event, 1, this.l2y1);
        }
        break;
      case 'l3y1':
        if (this.data.length >= 3 && this.l3y1.length === 0 && this.l3d1.length > 0) {
          console.log('3');
          this.copySeries(event, 2, this.l3y1);
        }
        break;
      case 'l4y1':
        if (this.data.length >= 4 && this.l4y1.length === 0 && this.l4d1.length > 0) {
          console.log('4');
          this.copySeries(event, 3, this.l4y1);
        }
        break;
      case 'l5y1':
        if (this.data.length >= 5 && this.l5y1.length === 0 && this.l5d1.length > 0) {
          console.log('5');
          this.copySeries(event, 4, this.l5y1);
        }
        break;
      case 'l1y2':
        if (this.data.length >= 1 && this.l1y2.length === 0 && this.l1y1.length > 0) {
          console.log('6');
          this.copySeries(event, 0, this.l1y2);
        }
        break;
      case 'l2y2':
        if (this.data.length >= 2 && this.l2y2.length === 0 && this.l2y1.length > 0) {
          console.log('6');
          this.l2y2 = [];
          this.copySeries(event, 1, this.l2y2);
        }
        break;
      case 'l3y2':
        if (this.data.length >= 3 && this.l3y2.length === 0 && this.l3y1.length > 0) {
          console.log('6');
          this.l3y2 = [];
          this.copySeries(event, 2, this.l3y2);
        }
        break;
      case 'l4y2':
        if (this.data.length >= 4 && this.l4y2.length === 0 && this.l4y1.length > 0) {
          console.log('6');
          this.l4y2 = [];
          this.copySeries(event, 3, this.l4y2);
        }
        break;
      case 'l5y2':
        if (this.data.length >= 5 && this.l5y2.length === 0 && this.l5y1.length > 0) {
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
    this.service.getChannelDetails(this.channelId, this.pagination).pipe(tap(x => {
      x.list.forEach(f => {
        f.program_schedules.forEach(fcp => {
          fcp.broadcast_start_date = fcp.broadcast_start_date.substring(5, 10);
          fcp.broadcast_end_date = fcp.broadcast_end_date.substring(5, 10);
        });
      });
    })).subscribe(res => {
      this.data = res.list;
      this.pagination = res.pagination;
      if (this.data.length >= 1 && this.data[0].program_schedules.length >= 1) {
        this.l1d1.push(this.data[0].program_schedules[0]);
      }

      if (this.data.length >= 2 && this.data[1].program_schedules.length >= 1) {
        this.l2d1.push(this.data[1].program_schedules[0]);
      }

      if (this.data.length >= 3 && this.data[2].program_schedules.length >= 1) {
        this.l3d1.push(this.data[2].program_schedules[0]);
      }

      if (this.data.length >= 4 && this.data[3].program_schedules.length >= 1) {
        this.l4d1.push(this.data[3].program_schedules[0]);
      }

      if (this.data.length >= 5 && this.data[4].program_schedules.length >= 1) {
        this.l5d1.push(this.data[4].program_schedules[0]);
      }

      if (this.data.length >= 1 && this.data[0].program_schedules.length >= 2) {
        this.l1y1.push(this.data[0].program_schedules[1]);
      }

      if (this.data.length >= 2 && this.data[1].program_schedules.length >= 2) {
        this.l2y1.push(this.data[1].program_schedules[1]);
      }

      if (this.data.length >= 3 && this.data[2].program_schedules.length >= 2) {
        this.l3y1.push(this.data[2].program_schedules[1]);
      }

      if (this.data.length >= 4 && this.data[3].program_schedules.length >= 2) {
        this.l4y1.push(this.data[3].program_schedules[1]);
      }

      if (this.data.length >= 5 && this.data[4].program_schedules.length >= 2) {
        this.l5y1.push(this.data[4].program_schedules[1]);
      }

      if (this.data.length >= 1 && this.data[0].program_schedules.length >= 3) {
        this.l1y2.push(this.data[0].program_schedules[2]);
      }

      if (this.data.length >= 2 && this.data[1].program_schedules.length >= 3) {
        this.l2y2.push(this.data[1].program_schedules[2]);
      }

      if (this.data.length >= 3 && this.data[2].program_schedules.length >= 3) {
        this.l3y2.push(this.data[2].program_schedules[2]);
      }

      if (this.data.length >= 4 && this.data[3].program_schedules.length >= 3) {
        this.l4y2.push(this.data[3].program_schedules[2]);
      }

      if (this.data.length >= 5 && this.data[4].program_schedules.length >= 3) {
        this.l5y2.push(this.data[4].program_schedules[2]);
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

