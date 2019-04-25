import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationDto, PaginationResponseDto } from '@shared';
import { ContractPaymentsDto } from './dtos';

declare interface OptionCustomer {
  custom: {
    custom_type: number;
    name: string;
    abbreviation: string;
    telephone: string;
    remark: string;
    tags: string[];
  };
  liaisons: OptionLiaison[];
}

declare interface OptionLiaison {
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
    return this.http.get<PaginationResponseDto<any>>(`/api/v1/custom?page=${pagination.page}&limit=${pagination.page_size}`);
  }

  addCustomer(customer: OptionCustomer) {
    return this.http.post<any>('/api/v1/custom', customer);
  }

  editCustomer(id: number, customer: OptionCustomer) {
    return this.http.put<any>(`/api/v1/custom/${id}`, customer);
  }

  deleteCustomers(id: number) {
    return this.http.delete<any>(`/api/v1/custom/${id}`);
  }

  getCustomerDetailsInfo(id: number) {
    return this.http.get<any>(`/api/v1/custom/${id}`);
  }

  getRights(pagination: PaginationDto, id: number, contract_type: 'purchase' | 'publish') {
    return this.http.get<PaginationResponseDto<any>>(`/api/v1/custom/${id}/program`, {
      params: { page: pagination.page as any, page_size: pagination.page_size as any, contract_type }
    });
  }

  getContracts(pagination: PaginationDto, id: number, contract_type: 'purchase' | 'publish') {
    return this.http.get<PaginationResponseDto<any>>(`/api/v1/custom/${id}/contract`,
      { params: { page: pagination.page as any, page_size: pagination.page_size as any, contract_type } });
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

  getLiaisons(customerId: number) {
    return this.http.get<PaginationResponseDto<any>>(`/api/v1/custom/${customerId}/liaison`);
  }

  getContractPayments(contractId: number) {
    return this.http.get<ContractPaymentsDto>(`/api/v1/rights/contracts/${contractId}/payments`);
  }

  addContractPayment(contractId: number, pay_amount: number, pay_date: string, pay_remark: string) {
    return this.http.post<{ id: number }>(`/api/v1/rights/contracts/${contractId}/payments`, { pay_amount, pay_date, pay_remark });
  }

  deleteContractPayment(paymentId: number) {
    return this.http.delete(`/api/v1/rights/contracts/payments/${paymentId}`);
  }

  addLiaison(customId: number, liaison: any) {
    return this.http.post(`/api/v1/custom/${customId}/liaison`, liaison);
  }

  mapCopyrights(list: any[]) {
    const rights = [];
    let itemIndex = 0;
    list.forEach(item => {
      let index = 0;
      item.rights.forEach(right => {
        rights.push({
          index: index++,
          itemIndex: itemIndex,
          pid: item.program_id,
          rid: right.id,
          project: item.program_name,
          investmentType: item.investment_type,
          type: item.program_type,
          episode: item.episode,
          right: right.right_type_label,
          area: right.area_label,
          term: right.start_date && right.end_date,
          termIsPermanent: right.permanent_date,
          termStartDate: right.start_date,
          termEndDate: right.end_date,
          termNote: right.date_remark,
          count: item.rights.length
        });
      });
      itemIndex++;
    });
    return rights;
  }
}
