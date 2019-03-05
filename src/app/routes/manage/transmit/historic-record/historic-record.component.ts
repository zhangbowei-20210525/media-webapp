import { Component, OnInit } from '@angular/core';
import { TransmitService } from '../transmit.service';
import { PaginationDto } from '@shared';
import { finalize, switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { TransmitScheduleComponent } from '../components/transmit-schedule/transmit-schedule.component';

@Component({
  selector: 'app-historic-record',
  templateUrl: './historic-record.component.html',
  styleUrls: ['./historic-record.component.less']
})
export class HistoricRecordComponent implements OnInit {

  isUploadRecordLoaded: boolean;
  isUploadRecordLoading: boolean;
  isDownloadRecordLoaded: boolean;
  isDownloadRecordLoading: boolean;
  uploadRecordPagination: PaginationDto;
  downloadRecordPagination: PaginationDto;
  uploadRecordList = [];
  downloadRecordList = [];
  id: number;

  constructor(
    private transmitService: TransmitService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.isUploadRecordLoaded = false;
    this.isUploadRecordLoading = true;
    this.uploadRecordPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.downloadRecordPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('id');
        return  this.transmitService.getUploadRecord(this.id, this.uploadRecordPagination);
      })
    ).pipe(finalize(() => {
      this.isUploadRecordLoading = false;
      this.isUploadRecordLoaded = true;
    })).subscribe(res => {
      this.uploadRecordList = res.list;
      this.uploadRecordPagination = res.pagination;
    });
  }

  uploadRecordPageChange(page: number) {
    this.isUploadRecordLoading = true;
    this.uploadRecordPagination.page = page;
    this.transmitService.getUploadRecord(this.id, this.uploadRecordPagination).pipe(finalize(() => {
      this.isUploadRecordLoading = false;
    })).subscribe(res => {
      this.uploadRecordList = res.list;
      this.uploadRecordPagination = res.pagination;
    });
  }

  uploadRecord() {
    this.isUploadRecordLoading = true;
    this.transmitService.getUploadRecord(this.id, this.uploadRecordPagination).pipe(finalize(() => {
      this.isUploadRecordLoading = false;
    })).subscribe(res => {
      this.uploadRecordList = res.list;
      this.uploadRecordPagination = res.pagination;
    });
  }

  downloadRecord() {
    this.isDownloadRecordLoaded = false;
    this.isDownloadRecordLoading = true;
    this.transmitService.getDownloadRecord(this.id, this.downloadRecordPagination).pipe(finalize(() => {
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
    this.transmitService.getDownloadRecord(this.id, this.downloadRecordPagination).pipe(finalize(() => {
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
      nzMaskClosable: true,
      nzClosable: true,
      nzCancelText: null,
      nzOkText: null,
      nzWidth: 800,
    });
  }
}
