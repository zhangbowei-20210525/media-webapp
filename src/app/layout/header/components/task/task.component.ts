import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueUploader } from '@shared/upload';
import { UploadInfo } from '@shared/upload';
import { Subscription } from 'rxjs';
import { NotifiesPolling } from '@core/notifies';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit, OnDestroy {
  message: any;

  subscriptions: Subscription[] = [];
  uploads = [] as UploadInfo[];
  uploadType: any;
  sourceUploads = [];
  // sourceUploadsPagination = { page: 1, page_size: 10 } as PaginationDto;
  // private timer;
  constructor(
    private uploader: QueueUploader,
    private ntf: NotifiesPolling,
  ) {
    // this.subscription = this.messageService.getMessage().subscribe(res =>{
    //   console.log(res)
    // })
  }
  ngOnInit() {
    this.ntf.setIsActiveSourceTasks(true);
    this.subscriptions = [
      this.uploader.change$.subscribe(() => {
        this.uploads = this.uploader.getList().reverse();
      }),
      this.ntf.notifies().subscribe(result => {
        // console.log(result);
        this.sourceUploads = result.active_source_tasks;
      })
    ];
    this.ntf.nextNotifies();
    // this.setTime();
    // this.getUploadsProgress();
  }

  // getUploadsProgress() {
  //   // return this.messageService.getMessage().subscribe(result => {
  //   //   // console.log(result)
  //   //   this.sourceUploads = result.type.active_source_tasks;
  //   // })
  //   return this.service.notifies().subscribe(result => {
  //     this.sourceUploads = result.type.active_source_tasks;
  //   })
  // }
  // getUploads() {
  //   this.service.getNotifiesUploads().subscribe( result => {
  //     this.sourceUploads = result.active_source_tasks
  //   })
  // }
  // setTime() {
  //   // this.getUploads();
  //   this.timer = setInterval(() => {
  //     this.getUploadsProgress();
  //   }, 5000);
  // }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // if (this.timer) {
    // clearInterval(this.timer);
    // }
    this.ntf.setIsActiveSourceTasks(false);
  }
}
