import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueueUploader } from '@shared/upload';
import { UploadInfo } from '@shared/upload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-tasks',
  templateUrl: './nav-tasks.component.html',
  styleUrls: ['./nav-tasks.component.less']
})
export class NavTasksComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  uploads = [] as UploadInfo[];

  constructor(
    private uploader: QueueUploader
  ) { }

  ngOnInit() {
    this.subscription = this.uploader.change$.subscribe(() => {
      this.uploads = this.uploader.getList().reverse();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
