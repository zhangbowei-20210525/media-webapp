import { Injectable } from '@angular/core';
import { ReactiveBase, ReactiveDatePicker, ReactiveTextbox } from '@shared';
import { HttpClient } from '@angular/common/http';
import { ContractDto, OrderPayDto, CopyrightDto, ProgramDto, AddCopyrightsDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class AddCopyrightsService {

  constructor(private http: HttpClient) { }

  getCopyrightAreaOptions() {
    return this.http.get<any[]>('/api/v1/rights/template/area_numbers');
  }

  getCopyrightTemplates() {
    return this.http.get<any[]>('/api/v1/rights/template/right_types');
  }

  addCopyrights(copyrightData: AddCopyrightsDto) {
    return this.http.post('/api/v1/rights', copyrightData);
  }

  getCustomerOptions() {
    return this.http.get<any>('/api/v1/custom');
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

  toContractData(contract_number: string, contract_name: string, remark: string, custom_id: number) {
    return {
      contract_number,
      contract_name,
      remark,
      custom_id
    } as ContractDto;
  }

  toOrderData(pay_amount: number, pay_date: string, pay_remark: string) {
    return {
      pay_amount,
      pay_date,
      pay_remark
    } as OrderPayDto;
  }

  toProgramData(program_id: number, program_name: string, program_type: string, episodes: number,
    investment_type: string, right_data: CopyrightDto[]) {
    return {
      program_id,
      program_name,
      program_type,
      episodes,
      investment_type,
      right_data
    } as ProgramDto;
  }

  toCopyrightData(right_type: string, right_remark: string, area_number: string, area_remark: string, permanent_date: boolean,
    start_date: string, end_date: string, date_remark: string, remark: string) {
      return {
        right_type,
        right_remark,
        area_number,
        area_remark,
        permanent_date,
        start_date,
        end_date,
        date_remark,
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

  groupBy(array: any[], f: (object: any) => any) {
    const groups = {};
    array.forEach(function (o) {
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }
}
