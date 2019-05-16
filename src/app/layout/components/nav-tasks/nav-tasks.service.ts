import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationResponseDto, PaginationDto } from '@shared';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavTasksService {
  constructor(private http: HttpClient) { }
  readonly changeType$ = new BehaviorSubject(0);
  sourceUploadsPagination = { page:1, page_size:10 } as PaginationDto
  getSourceUploads(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<any>>('/api/v1/source_tasks/activate/operator', { params: {
      page: pagination.page as any,
      page_size: pagination.page_size as any,
    } });
  }
  getData() {
    return this.getSourceUploads(this.sourceUploadsPagination)
  }
}
