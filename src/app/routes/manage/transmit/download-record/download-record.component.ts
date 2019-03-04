import { Component, OnInit } from '@angular/core';
import { PaginationDto } from '@shared';
import { TransmitService } from '../transmit.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { switchMap, finalize } from 'rxjs/operators';
import { TransmitScheduleComponent } from '../components/transmit-schedule/transmit-schedule.component';

@Component({
  selector: 'app-download-record',
  templateUrl: './download-record.component.html',
  styleUrls: ['./download-record.component.less']
})
export class DownloadRecordComponent implements OnInit {

  isDownloadRecordLoaded = false;
  isDownloadRecordLoading: boolean;
  downloadRecordPagination: PaginationDto;
  downloadRecordList = [];
  id: number;

  constructor(
    private transmitService: TransmitService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.isDownloadRecordLoaded = false;
    this.isDownloadRecordLoading = true;
    this.downloadRecordPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('id');
        return  this.transmitService.getPurchaseDownloadRecord(this.id, this.downloadRecordPagination);
      })
    ).pipe(finalize(() => {
      this.isDownloadRecordLoading = false;
      this.isDownloadRecordLoaded = true;
    })).subscribe(res => {
      this.downloadRecordList = res.list;
      this.downloadRecordPagination = res.pagination;
    });
  }

  downloadRecord() {
    this.isDownloadRecordLoaded = false;
    this.isDownloadRecordLoading = true;
    this.transmitService.getPurchaseDownloadRecord(this.id, this.downloadRecordPagination).pipe(finalize(() => {
      this.isDownloadRecordLoading = false;
      this.isDownloadRecordLoaded = true;
    })).subscribe(res => {
      this.downloadRecordList = res.list;
      this.downloadRecordPagination = res.pagination;
    });
  }

  downloadRecordPageChange(page: number) {
    this.isDownloadRecordLoading = true;
    this.downloadRecordPagination.page = page;
    this.transmitService.getPurchaseDownloadRecord(this.id, this.downloadRecordPagination).pipe(finalize(() => {
      this.isDownloadRecordLoading = false;
    })).subscribe(res => {
      this.downloadRecordList = res.list;
      this.downloadRecordPagination = res.pagination;
    });
  }

  transmitSchedule(id) {
    this.modalService.create({
      nzTitle: `进度信息`,
      nzContent: TransmitScheduleComponent,
      nzComponentParams: { id: id },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addTapeAgreed
    });
  }

  addTapeAgreed = (component: TransmitScheduleComponent) => new Promise((resolve) => {
    // component.formSubmit()
    //   .subscribe(res => {
    //     this.message.success(this.translate.instant('global.add-success'));
    //     this.seriesService.getTapeList(this.id).subscribe(t => {
    //       this.tapesList = t.data;
    //     });
    //     resolve();
    //   }, error => {
    //     if (error.message) {
    //       this.message.error(error.message);
    //     }
    //   });
  })

}
