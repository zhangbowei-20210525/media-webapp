import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueUploader } from '@shared/upload';
import { UploadInfo } from '@shared/upload';
import { Subscription } from 'rxjs';
import { PaginationResponseDto, PaginationDto } from '@shared';
import { NavTasksService } from './nav-tasks.service';
@Component({
  selector: 'app-nav-tasks',
  templateUrl: './nav-tasks.component.html',
  styleUrls: ['./nav-tasks.component.less'],
})
export class NavTasksComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  uploads = [] as UploadInfo[];
  uploadType: any;
  sourceUploads = [];
  sourceUploadsPagination = { page: 1, page_size: 10 } as PaginationDto;
  private timer;
  constructor(
    private uploader: QueueUploader,
    private service: NavTasksService,
  ) { }
  ngOnInit() {
    this.subscriptions = [
      this.uploader.change$.subscribe(() => {
        this.uploads = this.uploader.getList().reverse();
      }),
      this.service.changeType$.subscribe(() => {
        console.log('ssssss');
        this.uploadType = this.service.getSourceUploads(this.sourceUploadsPagination);
        this.sourceUploads = this.uploadType.list;
        this.sourceUploadsPagination = this.uploadType.pagination;
      })
    ]
    // this.setTime();
  }
  // getProgress() {
  //   console.log('11111111')
  //   this.service.getSourceUploads(this.sourceUploadsPagination).subscribe(result => {
  //     console.log(result, 'wwww');
  //     this.sourceUploads = result.list;
  //     this.sourceUploadsPagination = result.pagination;
  //   });
  // }
  // setTime() {
  //   this.getProgress();
  //   this.timer = setInterval(() => {
  //     this.getProgress();
  //   }, 5000);
  // }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // if (this.timer) {
    // clearInterval(this.timer);
    // }
  }
}
