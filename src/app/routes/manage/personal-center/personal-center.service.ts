import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonalCenterDto } from './personal-center.dto';
import { PaginationDto } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class PersonalCenterService {

  constructor(
    private http: HttpClient
  ) { }

  getUserInfo() {
    return this.http.get<PersonalCenterDto>('/api/v1/users/info');
  }

  getUserEmployees() {
    return this.http.get<any>('/api/v1/users/info/employees');
  }

  getBrowseRecord(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/publicity/history?page=${pagination.page}&limit=${pagination.page_size}`);
  }
  getShareRecord(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/publicity/collections?page=${pagination.page}&page_size=${pagination.page_size}`);
  }
  getReviewSample(id: number) {
    return this.http.get<any>(`/api/v1/publicity/collections/${id}/received_publicitys`);
  }
  getShareList(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/publicity/share?page=${pagination.page}&page_size=${pagination.page_size}`);
  }
}
