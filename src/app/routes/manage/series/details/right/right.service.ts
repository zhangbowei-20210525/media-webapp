import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationResponseDto, PaginationDto } from '@shared';
import { RightDetailsDto, RightDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class RightService {

  constructor(private http: HttpClient) { }

  getOwnRights(pid: number) {
    // return this.http.get<RightDetailsDto>(`/api/v1/rights/programs/${pid}`);
    return this.http.get<RightDetailsDto>(`/api/v1/programs/copyrights/${pid}`);
  }

  deleteOwnRights(id: number) {
    return this.http.delete(`/api/v1/rights/${id}`);
  }

  getPublishRights(pid: number, pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<RightDto>>(`/api/v1/rights/programs/${pid}/publish`,
    { params: { page: pagination.page as any, page_size: pagination.page_size as any } });
  }

  deletePublishRights(id: number) {
    return this.http.delete(`/api/v1/rights/publish/${id}`);
  }
}
