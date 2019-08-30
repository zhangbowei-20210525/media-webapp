import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationResponseDto, PaginationDto } from '@shared';
import { NotifyDto } from '../../dtos';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private http: HttpClient) { }

  /**
   * 获取系统消息
   */
  getSystemNotify(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<NotifyDto>>('/api/v1/notifies?title=system', {
      params: {
        page: pagination.page as any,
        page_size: pagination.page_size as any
      }
    });
  }

  /**
   * 获取母带消息
   */
  getSourceNotify(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<NotifyDto>>('/api/v1/notifies?title=source', {
      params: {
        page: pagination.page as any,
        page_size: pagination.page_size as any
      }
    });
  }

  /**
   * 获取外部消息
   */
  getOutsideNotify(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<NotifyDto>>('/api/v1/notifies?title=outside', {
      params: {
        page: pagination.page as any,
        page_size: pagination.page_size as any
      }
    });
  }

  getAuthorizationInfo(id: number) {
    return this.http.get<any>(`/api/v1/sources/auth/receipt/${id}`);
  }
  getSharingInfo(id: number) {
    return this.http.get<any>(`/api/v1/publicity/share/${id}`);
  }

  getAccept(status, company_id, company_full_name, id: number) {
    return this.http.put<any>(`/api/v1/publicity/share/${id}`, {
      company_id,
      status,
      company_full_name
    });
  }
  refusedPubAuth(status, id: number) {
    return this.http.patch<any>(`/api/v1/sources/auth/receipt/${id}`, {
      status,
    });
  }

  pubAuth(status, company_id, id: number) {
    return this.http.patch<any>(`/api/v1/sources/auth/receipt/${id}`, {
      status,
      company_id
    });
  }

  newPubAuth(status, company_full_name, id: number) {
    return this.http.patch<any>(`/api/v1/sources/auth/receipt/${id}`, {
      status,
      company_full_name,
    });
  }

  getCompanyList() {
    return this.http.get<any>(`/api/v1/users/info/employees`);
  }

  switchCompany(company_id: number) {
    return this.http.post<{ token: string, auth: any, permissions: any[] }>(`/api/v1/login/company`, { company_id });
  }

  getSolicitationInfo(id: number) {
    return this.http.get<any>(`/api/v1/publicity/collections/${id}`);
  }

  getEmployeesInvitedInfo(id: number) {
    return this.http.get<any>(`/api/v1/companies/employees/${id}/application`);
  }

  eimDetermine(id: number, result: boolean) {
    return this.http.post<any>(`/api/v1/companies/employees/${id}/application/result`, { result });
  }


}
