import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { TransmitService } from 'app/routes/manage/transmit/transmit.service';
import { NzModalService } from 'ng-zorro-antd';
import { MessageService } from '@shared';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.less']
})
export class ProcessComponent implements OnInit, OnDestroy {

  @Input() id: number;
  transmitScheduleList = [];
  showInfo = true;
  refreshInterval: any;
  transmitScheduleSubject: Subject<any> = new Subject();

  constructor(
    private transmitService: TransmitService,
    private modalService: NzModalService,
    private message: MessageService,
  ) {
    this.transmitScheduleList = [];
    this.transmitScheduleSubject.pipe(switchMap(x =>
      this.transmitService.getTransmitSchedule(this.id))).subscribe(res => {
        this.transmitScheduleList = res;
      }, err => console.log(err));
   }

  ngOnInit() {
    this.refreshInterval = setInterval(() => this.tapePurchaseDownloadRecordDetails(), 10000);
    this.transmitService.getTransmitSchedule(this.id).subscribe(res => {
      this.transmitScheduleList = res;
    }
    );
  }

  tapePurchaseDownloadRecordDetails() {
    this.transmitScheduleSubject.next();
  }

  cancelTask(id: number, status: number) {
    this.modalService.confirm({
      nzTitle: '确定要中止下载任务？',
      // nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.cancelTaskAgreed(id, status)
    });
  }

  cancelTaskAgreed = (id: number, status: number) => new Promise((resolve) => {
    status = 10;
    this.transmitService.cancelDownloadTask(id).subscribe(
      res => {
        this.transmitService.getTransmitSchedule(this.id).subscribe(t => {
          this.transmitScheduleList = t;
        }
        );
        // this.message.success(this.translate.instant('global.add-success'));
        // this.nzMessageService.success('已取消下载任务');
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
        resolve(false);
      });
  })
  ngOnDestroy(): void {
    clearInterval(this.refreshInterval);
  }

}
