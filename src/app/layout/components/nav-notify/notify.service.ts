import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationResponseDto, PaginationDto } from '@shared';
import { NotifyDto } from 'app/layout/dtos';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private http: HttpClient) { }

  /**
   * 获取系统消息
   */
  getSystemNotify(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<NotifyDto>>('/api/v1/notifies?title=system', { params: {
      page: pagination.page as any,
      page_size: pagination.page_size as any
    } });
  }

  /**
   * 获取母带消息
   */
  getSourceNotify(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<NotifyDto>>('/api/v1/notifies?title=source', { params: {
      page: pagination.page as any,
      page_size: pagination.page_size as any
    } });
  }

  /**
   * 获取外部消息
   */
  getOutsideNotify(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<NotifyDto>>('/api/v1/notifies?title=outside', { params: {
      page: pagination.page as any,
      page_size: pagination.page_size as any
    } });
  }
}
