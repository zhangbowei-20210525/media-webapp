import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationResponseDto, PaginationDto } from '@shared';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TopBarService {
  uploadsNumber: number;
  // ActiveSourceTasks={
  // activeSourceTasks = true;
  // };
  // readonly changeType$ = new BehaviorSubject(0);
  constructor(private http: HttpClient) { }

  // getNotifiesUploads(pagination: PaginationDto) {
  //   return this.http.get<PaginationResponseDto<any>>('/api/v1/polling ', { params: {
  //     active_source_tasks: pagination as any,
  //   } });
  // }
  getNotifiesUploads(activeSourceTasks) {
    return this.http.get<any>('/api/v1/polling', { params: {
      active_source_tasks: (activeSourceTasks ? 1 : 0) as any,
    } });
  }
  }