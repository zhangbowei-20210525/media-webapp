import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationResponseDto, PaginationDto } from '@shared';
// import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavTasksService {
  constructor(private http: HttpClient) { }
  // readonly changeType$ = new BehaviorSubject(0);
  // sourceUploadsPagination = { page:1, page_size:10 } as PaginationDto
  // getSourceUploads() {
  //   return this.http.get<PaginationResponseDto<any>>('/api/v1/polling');
  // }
}