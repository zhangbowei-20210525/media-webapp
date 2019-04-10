import { Component, OnInit } from '@angular/core';
import { PaginationDto } from '@shared';
import { TransmitService } from '../transmit.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
    private router: Router,
  ) { }

  ngOnInit() {
    this.pgination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
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
      nzMaskClosable: true,
      nzClosable: true,
      nzCancelText: null,
      nzOkText: null,
      nzWidth: 800,
    });
  }

  goBack() {
    this.router.navigate([`/manage/transmit`, {tabIndex: 1}]);
  }
}
