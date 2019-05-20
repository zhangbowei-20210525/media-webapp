import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueUploader } from '@shared/upload';
import { UploadInfo } from '@shared/upload';
import { Subscription } from 'rxjs';
import { PaginationResponseDto, PaginationDto } from '@shared';
import { TopBarService } from '../../top-bar.service';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  uploads = [] as UploadInfo[];
  uploadType: any;
  sourceUploads = [];
  sourceUploadsPagination = { page: 1, page_size: 10 } as PaginationDto;
  private timer;
  activeSourceTasks = true;
  constructor(
    private uploader: QueueUploader,
    private service: TopBarService,
  ) { }
  ngOnInit() {
    this.subscriptions = [
      this.uploader.change$.subscribe(() => {
        this.uploads = this.uploader.getList().reverse();
        // console.log(this.uploads)
      }),
      // this.service.changeType$.subscribe(() => {
      //   console.log('ssssss');
        // this.uploadType = this.service.getSourceUploads(this.sourceUploadsPagination);
      //   this.uploadType.subscribe(res => {
      //     console.log(res);
      //     this.sourceUploads = res.list;
      //     this.sourceUploads = res.list;
      //   this.sourceUploadsPagination = res.list.pagination;
      //   })
      // })
    ]
    // this.setTime();
  }
  getUploadsProgress() {
    this.service.getNotifiesUploads(this.activeSourceTasks).subscribe(result => {
      console.log(result);
      // this.uploadsLength = result.base.active_source_task_num;
      // console.log( this.uploadsLength)
      // this.uploadStatus = result.base.has_active_source_task;
      // console.log( this.uploadStatus)
      // this.uploads = this.upload + this.uploadsLength;
      // console.log(this.uploads, 'ccc'); 
    });
  }
  // getProgress() {
  //   this.service.getSourceUploads().subscribe(result => {
  //     console.log(result)
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
    if (this.timer) {
    clearInterval(this.timer);
    }
  }
}
