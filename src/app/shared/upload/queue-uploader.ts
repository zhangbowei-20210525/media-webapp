import { map, tap, last } from 'rxjs/operators';
import { HttpResponse, HttpEvent, HttpEventType, HttpRequest, HttpClient } from '@angular/common/http';
import { formData } from '@shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueueUploader {

  readonly change$ = new BehaviorSubject(0);
  private readonly queue = [] as UploadInfo[];
  private current = null;

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService
  ) { }

  get isUploading() {
    return !!this.current;
  }

  /**
   * 激活队列
   */
  private set() {
    if (this.current) {
      return false;
    } else {
      const file = this.queue.pop();
      if (file) {
        this.upload(file);
        return true;
      }
      return false;
    }
  }

  /**
	 * 重置队列状态
	 */
  private reset() {
    this.current = null;
    this.set();
    this.notifyChnages();
  }

  /**
	 * 队列上传
	 * @param upload 上传对象
	 */
  private upload(upload: UploadInfo) {
    this.current = upload;
    upload.status = UploadStatus.Uploading;

    this.request(upload.target, upload.file, upload.url, data => {
      if (typeof data === 'number') {
        upload.progress = data as number;
      }
    })
      .pipe(map((rp: HttpResponse<any>) => rp.ok === true ? rp.body : rp))
      .subscribe(result => {
        upload.status = UploadStatus.Success;
        let handle = false; // 是否已处理结果
        try {
          if (upload.success) {
            handle = upload.success(upload, result);
          }
        } catch (e) {
          console.error(e);
        }
        if (!handle) {
          this.notification.success('文件上传成功', `文件 ${upload.name} 上传完成。`);
        }
        this.reset();
      }, err => {
        upload.status = UploadStatus.Fail;
        let handle = false;
        try {
          if (upload.fail) {
            handle = upload.fail(upload, err);
          }
        } catch (e) {
          console.error(e);
        }
        if (!handle) {
          this.notification.error('文件上传出错', `文件 ${upload.name} 上传失败，服务器错误。`);
        }
        this.reset();
      });
  }

  /**
	 * 上传请求
	 * @param target 上传目标id，预留
	 * @param file 上传文件
   * @param url 上次路径
	 * @param cb 进度回调
	 */
  private request(target: number, file: File, url: string, cb: (data: any) => void) {
    function getProgress(event: HttpEvent<any>) {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const percentDone = Math.round(100 * event.loaded / event.total);
          return percentDone;
        default:
          return event;
      }
    }
    const req = new HttpRequest(
      'POST', url,
      formData({ file: file }),
      { reportProgress: true });

    return this.http.request(req).pipe(
      map(event => getProgress(event)),
      tap(message => cb && cb(message)),
      last()
    );
  }

  /**
	 * 排入队列等待上传
	 * @param target 上传目标系列id
	 * @param element 文件对象
	 */
  enqueue(upload: UploadInfo) {
    this.queue.unshift(upload);
    this.set();
    this.notifyChnages();
    return upload;
  }

  private notifyChnages() {
    try {
      let base = 0;
      if (this.current) {
        base = 1;
      }
      this.change$.next(this.queue.length + base);
    } catch (e) {
      console.error(e);
    }
  }

  getList() {
    return this.current ? this.queue.concat([this.current]) : this.queue.concat();
  }
}

export interface UploadInfo {
  target: number;
  url: string;
  size: number;
  name: string;
  extension: string;
  progress: number;
  file: File;
  createAt?: Date;
  status?: UploadStatus;
  success?: (upload?: UploadInfo, result?: any) => boolean;
  fail?: (upload?: UploadInfo, error?: any) => boolean;
}

export enum UploadStatus {
  Ready = 1,
  Uploading,
  Success,
  Fail
}
