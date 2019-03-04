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

  isLoaded = false;
  isLoading = false;
  pgination: PaginationDto;
  list = [];
  id: number;

  constructor(
    private service: TransmitService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
      this.loadDownloadRecords();
    });
  }

  loadDownloadRecords() {
    this.isLoading = true;
    this.service.getPurchaseDownloadRecord(this.id, this.pgination).pipe(finalize(() => {
      this.isLoading = false;
      this.isLoaded = true;
    })).subscribe(result => {
      this.list = result.list;
      this.pgination = result.pagination;
    });
  }

  fetchDownloadRecords() {
    this.isLoading = true;
    this.service.getPurchaseDownloadRecord(this.id, this.pgination)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(result => {
        this.list = [...this.list, ...result.list];
        this.pgination = result.pagination;
      });
  }

  onPageChange(page: number) {
    this.pgination.page = page;
    this.fetchDownloadRecords();
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
