import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { PaginationResponseDto, PaginationDto } from '@shared';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TopBarService {
  uploadsNumber: number;
  readonly changeType$ = new BehaviorSubject(0);
  constructor(private http: HttpClient) { }

  // getSourceUploads(pagination: PaginationDto) {
  //   return this.http.get<PaginationResponseDto<any>>('/api/v1/source_tasks/activate/operator', { params: {
  //     page: pagination.page as any,
  //     page_size: pagination.page_size as any,
  //   } });
  // }
  getNotifiesUploads() {
    return this.http.get<any>('/api/v1/notifies/overview');
  }
  getNumber () {
    this.getNotifiesUploads().subscribe(result => {
      this.uploadsNumber = result.active_source_task_num;
      console.log(this.uploadsNumber, '我要执行');
    });
  }
  sendNumber() {
    this.changeType$.next(this.uploadsNumber);
  }
}
