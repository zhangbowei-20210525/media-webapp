import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContractCopyrightDto } from '../dtos/contract-copyright.dto';
import { PaginationDto } from '@shared';
import { ReactiveBase } from './reactive-base';
import { ReactiveDatePicker } from './reactive-date-picker';
import { ReactiveTextbox } from './reactive-textbox';


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

  getExistRightSeries(keywords: string) {
    return this.http.get<{ id: number, series_name: string, series_type: string, episodes_num: number }[]>(
      '/api/v1/series/exist_right', { params: { keywords: keywords } });
  }

  addCopyrights(contract: ContractCopyrightDto) {
    return this.http.post<any>('/api/v1/rights', contract);
  }

  purchaseCopyrights(contract: ContractCopyrightDto) {
    return this.http.post<any>('/api/v1/rights?type=purchase', contract);
  }

  publishCopyrights(contract: ContractCopyrightDto) {
    return this.http.post<any>('/api/v1/publish_rights', contract);
  }

  homemadeCopyrights(contract: ContractCopyrightDto) {
    return this.http.post<any>('/api/v1/rights?type=homemade', contract);
  }

  getCopyrightList(pagination: PaginationDto, term: string, area: string, right: string) {
    return this.http.get<any>
    (`/api/v1/rights?page=${pagination.page}&page_size=${pagination.page_size}&due_date=${term}&area_number=${area}&right_type=${right}`);
  }

  deleteCopyright(id: number) {
    return this.http.delete<any>(`/api/v1/rights/${id}`);
  }

  getOwnCopyrightDetailsInfo(id: number) {
    return this.http.get<any>(`/api/v1/rights/${id}`);
  }

  getPubCopyrightDetailsInfo(pagination: PaginationDto, id: number) {
    return this.http.get<any>(`/api/v1/publish_rights/${id}?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  deleteCopyrightDetailsInfo(id: number) {
    return this.http.delete<any>(`/api/v1/rights_detail/${id}`);
  }

  getCopyrightPaymentReactives(count: number): ReactiveBase<any>[][] {
    const payments: ReactiveBase<any>[][] = [];
    for (let index = 0; index < count; index++) {
      const payment: ReactiveBase<any>[] = [
        new ReactiveDatePicker({
          key: 'paymentDate' + index,
          label: '付款日期',
          required: true,
          format: 'yyyy/MM/dd',
          order: 1
        }),
        new ReactiveTextbox({
          key: 'money' + index,
          label: '金额',
          required: true,
          type: 'text',
          reg: '[0-9]*(/.[0-9]{1,2})?',
          order: 2
        }),
        new ReactiveTextbox({
          key: 'note' + index,
          label: '备注',
          type: 'text',
          order: 3
        })
      ];
      payment.sort((a, b) => a.order - b.order);
      payments.push(payment);
    }
    return payments;
  }

  getPublishCopyrightPaymentReactives(count: number): ReactiveBase<any>[][] {
    const payments: ReactiveBase<any>[][] = [];
    for (let index = 0; index < count; index++) {
      const payment: ReactiveBase<any>[] = [
        new ReactiveDatePicker({
          key: 'paymentDate' + index,
          label: '收款日期',
          required: true,
          format: 'yyyy/MM/dd',
          order: 1
        }),
        new ReactiveTextbox({
          key: 'money' + index,
          label: '金额',
          required: true,
          type: 'text',
          reg: '[0-9]*(/.[0-9]{1,2})?',
          order: 2
        }),
        new ReactiveTextbox({
          key: 'note' + index,
          label: '备注',
          type: 'text',
          order: 3
        })
      ];
      payment.sort((a, b) => a.order - b.order);
      payments.push(payment);
    }
    return payments;
  }

  getCopyrightsType() {
    return this.http.get<any[]>('/api/v1/rights/template/right_types');
  }
}
