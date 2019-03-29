import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationDto } from '@shared';

declare interface AddEditCustomer {
  custom_type: number;
  name: string;
  abbreviation: string;
  telephone: string;
  remark: string;
  tags: string[];
  liaisons: AddEditLiaison[];
}

declare interface AddEditLiaison {
  liaison_name: string;
  phone: string;
  wx_id: string;
  email: string;
  department: string;
  position: string;
  remark: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    protected http: HttpClient,
  ) { }

  getCustomers(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/custom?page=${pagination.page}&limit=${pagination.page_size}`);
  }

  addCustomer(customer: AddEditCustomer) {
    return this.http.post<any>('/api/v1/custom', customer);
  }

  editCustomer(id: number, customer: AddEditCustomer) {
    return this.http.put<any>(`/api/v1/custom/${id}`, customer);
  }

  deleteCustomers(id: number) {
    return this.http.delete<any>(`/api/v1/custom/${id}`);
  }

  getCustomerDetailsInfo(id: number) {
    return this.http.get<any>(`/api/v1/custom/${id}`);
  }

  getRights(pagination: PaginationDto, id: number) {
    return this.http.get<any>(`/api/v1/custom/${id}/program?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getContracts(pagination: PaginationDto, id: number) {
    return this.http.get<any>(`/api/v1/custom/${id}/contract?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getLogs(pagination: PaginationDto, id: number) {
    return this.http.get<any>(`/api/v1/custom/${id}/follow?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  addLog(id: number, newLog: { content: string, title: string }) {
    return this.http.post<any>(`api/v1/custom/${id}/follow`, newLog);
  }

  deleteLog(cid: number, id: number) {
    return this.http.delete<any>(`/api/v1/custom/${cid}/follow/${id}`);
  }

  getTags() {
    return this.http.get<string[]>('/api/v1/custom/tag');
  }
}
