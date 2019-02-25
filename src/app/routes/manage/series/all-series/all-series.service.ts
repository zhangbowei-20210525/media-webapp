import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationDto, PaginationResponseDto } from '@shared';
import { SeriesDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class AllSeriesService {

  constructor(private http: HttpClient) { }

  getSeries(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<SeriesDto>>(`/api/v1/program?page=${pagination.page}&page_size=${pagination.page_size}`);
  }
}
