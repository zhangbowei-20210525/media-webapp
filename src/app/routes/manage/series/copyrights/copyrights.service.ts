import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContractCopyrightDto } from '../dtos';
import { PaginationDto, PaginationResponseDto, ReactiveBase, ReactiveDatePicker, ReactiveTextbox, formData } from '@shared';
import {
  CopyrightSeriesDto, AddCopyrightsDto, ContractDto, OrderPayDto, CopyrightDto, ProgramDto, PublishRightsDto, RootTemplateDto
} from './dtos';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

declare interface FiltrateSeriesParams {
  due_date: string;
  area_number: string;
  right_type: string;
  start_date: string;
  end_date: string;
  is_salable: string;
  investment_type: string;
  program_type: string;
  custom_id: string;
  search?: string;
  sole: string;
}

@Injectable({
  providedIn: 'root'
})
export class CopyrightsService {

  constructor(
    protected http: HttpClient,
  ) { }

  // getCopyrightAreaOptions() {
  //   return this.http.get<any[]>('/api/v1/rights/area_numbers');
  // }

  // getCustomerWithLikeKeyword(keyword: string) {
  //   return this.http.get<{ id: number, name: string, contact_name: string }[]>(
  //     '/api/v1/customer/search', { params: { keyword: keyword } });
  // }

  // getSeriesWithLikeKeyword(keywords: string) {
  //   return this.http.get<{ id: number, series_name: string, series_type: string, episodes_num: number }[]>(
  //     '/api/v1/series/search', { params: { keywords: keywords } });
  // }

  getDefaultFiltrateSeriesParams(search?: string) {
    return {
      due_date: '',
      area_number: '',
      right_type: '',
      start_date: '',
      end_date: '',
      is_salable: '',
      investment_type: '',
      program_type: '',
      custom_id: '',
      sole: '',
      search: search,
    } as FiltrateSeriesParams;
  }

  getSeries(pagination: PaginationDto, params: FiltrateSeriesParams) {
    return this.http.get<PaginationResponseDto<CopyrightSeriesDto>>('/api/v1/rights/programs', {
      params: {
        page: pagination.page as any, page_size: pagination.page_size as any,
        due_date: params.due_date, area_number: params.area_number, right_type: params.right_type,
        start_date: params.start_date, end_date: params.end_date, is_salable: params.is_salable, sole: params.sole,
        investment_type: params.investment_type, program_type: params.program_type, q: params.search || ''
      }
    });
  }

  getPubRights(pagination: PaginationDto, params: FiltrateSeriesParams) {
    return this.http.get<any>('/api/v1/rights/publish/programs', {
      params: {
        page: pagination.page as any, page_size: pagination.page_size as any,
        due_date: params.due_date, area_number: params.area_number, right_type: params.right_type,
        start_date: params.start_date, end_date: params.end_date, custom_id: params.custom_id, sole: params.sole,
        investment_type: params.investment_type, program_type: params.program_type, q: params.search || ''
      }
    });
  }

  // getSearchSeries(
  //   search: any,
  //   pagination: PaginationDto,
  //   due_date: string,
  //   area_number: string,
  //   right_type: string,
  //   start_date: string,
  //   end_date: string,
  //   is_salable: string
  // ) {
  //   return this.http.get<PaginationResponseDto<CopyrightSeriesDto>>(`/api/v1/rights/programs?q=${search}`,
  //     {
  //       params: {
  //         page: pagination.page as any, page_size: pagination.page_size as any,
  //         due_date, area_number, right_type, start_date, end_date, is_salable
  //       }
  //     });
  // }

  deleteCopyrights(pid: number) {
    return this.http.delete(`/api/v1/rights/programs/${pid}`);
  }

  deletePubCopyrights(pid: number) {
    return this.http.delete(`/api/v1/rights/publish/programs/${pid}`);
  }

  getCopyrightAreaOptions() {
    return this.http.get<RootTemplateDto[]>('/api/v1/rights/template/area_numbers');
  }

  getCopyrightTemplates() {
    return this.http.get<RootTemplateDto[]>('/api/v1/rights/template/right_types');
  }

  addCopyrights(copyrightData: AddCopyrightsDto) {
    return this.http.post('/api/v1/rights', copyrightData);
  }

  getCustomerOptions() {
    return this.http.get<any>('/api/v1/custom');
  }

  publishRights(rightsData: PublishRightsDto) {
    return this.http.post('/api/v1/rights/publish', rightsData);
  }

  getSeriesNames(program_ids?: number[]) {
    return this.http.get<{ list: any[], meta: any }>(`/api/v1/programs/brief?program_ids=${program_ids}`);
  }

  getPrograms() {
    return this.http.get<PaginationResponseDto<any>>('/api/v1/program');
  }

  setLeafNode(nodes: any[]) {
    for (const key in nodes) {
      if (nodes.hasOwnProperty(key)) {
        const element = nodes[key];
        if (!(element.children && element.children.length > 0)) {
          element.isLeaf = true;
        } else {
          this.setLeafNode(element.children);
        }
      }
    }
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
          order: 1,
          customerType: 'payment'
        }),
        new ReactiveTextbox({
          key: 'money' + index,
          label: '金额',
          required: true,
          type: 'text',
          reg: /^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/,
          order: 2,
          customerType: 'money'
        }),
        new ReactiveTextbox({
          key: 'percent' + index,
          label: '金额占比',
          type: 'text',
          order: 3,
          customerType: 'percent',
          disabled: true
        }),
        new ReactiveTextbox({
          key: 'note' + index,
          label: '备注',
          type: 'text',
          order: 4,
          customerType: 'remark'
        })
      ];
      payment.sort((a, b) => a.order - b.order);
      payments.push(payment);
    }
    return payments;
  }

  getPublishRightsPaymentReactives(count: number): ReactiveBase<any>[][] {
    const payments: ReactiveBase<any>[][] = [];
    for (let index = 0; index < count; index++) {
      const payment: ReactiveBase<any>[] = [
        new ReactiveDatePicker({
          key: 'paymentDate' + index,
          label: '收款日期',
          required: true,
          format: 'yyyy/MM/dd',
          order: 1,
          customerType: 'payment'
        }),
        new ReactiveTextbox({
          key: 'money' + index,
          label: '金额',
          required: true,
          type: 'text',
          reg: /^[1-9]{1}\d*(.\d{1,2})?$|^0.\d{1,2}$/,
          order: 2,
          customerType: 'money'
        }),
        new ReactiveTextbox({
          key: 'percent' + index,
          label: '金额占比',
          type: 'text',
          order: 3,
          customerType: 'percent',
          disabled: true
        }),
        new ReactiveTextbox({
          key: 'note' + index,
          label: '备注',
          type: 'text',
          order: 4,
          customerType: 'remark'
        })
      ];
      payment.sort((a, b) => a.order - b.order);
      payments.push(payment);
    }
    return payments;
  }

  toContractData(contract_number: string, contract_name: string, remark: string,
    custom_name: string, sign_date: string, total_amount: number) {
    return {
      contract_number,
      contract_name,
      remark,
      custom_name,
      sign_date,
      total_amount
    } as ContractDto;
  }

  toOrderData(pay_amount: number, pay_date: string, pay_remark: string) {
    return {
      pay_amount,
      pay_date,
      pay_remark
    } as OrderPayDto;
  }

  toProgramData(program_id: number, program_name: string, program_type: string, theme: string, episodes: number,
    investment_type: string, right_data: CopyrightDto[]) {
    return {
      program_id,
      program_name,
      program_type,
      theme,
      episodes,
      investment_type,
      right_data
    } as ProgramDto;
  }
  toPubProgramData(program_id: number, program_name: string, program_type: string, episodes: number,
    right_data: CopyrightDto[]) {
    return {
      program_id,
      program_name,
      program_type,
      episodes,
      right_data
    } as ProgramDto;
  }

  toCopyrightData(sole: boolean, right_type: string, child_rights: string[], right_remark: string, area_number: string, area_remark: string,
    permanent_date: boolean, start_date: string, end_date: string, date_remark: string, remark: string, broadcast_channel?: string,
    air_date?: string) {
    return {
      sole,
      right_type,
      child_rights,
      right_remark,
      area_number,
      area_remark,
      permanent_date,
      start_date,
      end_date,
      date_remark,
      broadcast_channel,
      air_date,
      remark
    } as CopyrightDto;
  }

  toAddCopyrightsData(contract_data: ContractDto, order_data: OrderPayDto[], program_data: ProgramDto[]) {
    return {
      contract_data,
      order_data,
      program_data
    } as AddCopyrightsDto;
  }

  toPublishRightsData(contract_data: ContractDto, order_data: OrderPayDto[], program_data: ProgramDto[]) {
    return {
      contract_data,
      order_data,
      program_data
    } as PublishRightsDto;
  }

  groupBy<T>(array: T[], f: (object: any) => any): T[][] {
    const groups = {};
    array.forEach((o) => {
      const group = JSON.stringify(f(o));
      // if (group === 'null') {
      //   group = _.uniqueId(); // 如果没有id，则单独分组，以避免所有无id的对象分到一组
      // }
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(group => groups[group]);
  }
}
