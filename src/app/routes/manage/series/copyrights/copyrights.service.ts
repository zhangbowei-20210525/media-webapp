import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContractCopyrightDto } from '../dtos/contract-copyright.dto';
import { PaginationDto, PaginationResponseDto } from '@shared';
import { CopyrightSeriesDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class CopyrightsService {

  constructor(
    protected http: HttpClient,
  ) { }

  getCopyrightAreaOptions() {
    return this.http.get<any[]>('/api/v1/rights/area_numbers');
  }

  getCustomerWithLikeKeyword(keyword: string) {
    return this.http.get<{ id: number, name: string, contact_name: string }[]>(
      '/api/v1/customer/search', { params: { keyword: keyword } });
  }

  getSeriesWithLikeKeyword(keywords: string) {
    return this.http.get<{ id: number, series_name: string, series_type: string, episodes_num: number }[]>(
      '/api/v1/series/search', { params: { keywords: keywords } });
  }

  getSeries(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<CopyrightSeriesDto>>('/api/v1/right_programs',
      { params: { page: pagination.page as any, page_size: pagination.page_size as any } });
  }

  deleteCopyrights(pid: number) {
    return this.http.delete(`/api/v1/right_programs/${pid}`);
  }
}
