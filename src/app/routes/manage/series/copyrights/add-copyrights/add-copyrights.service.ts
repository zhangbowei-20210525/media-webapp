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

  addCopyrights(contract_data: any) {
    return this.http.post('/api/v1/rights', contract_data);
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

  toProgramData(program_id: number, program_name: string, program_type: string, episodes: number, investment_type: string, right_data: CopyrightDto[]) {
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
}

const data = {
  "contract_data": {
    "contract_number": "SINFU79902857",
    "contract_name": "测试合同一",
    "remark": "测试合同备注一",
    "custom_id": 1
  },
  "order_data": [
    {
      "pay_amount": 100000,
      "pay_date": "2019-6-1",
      "pay_remark": "测试账单备注一"
    },
    {
      "pay_amount": 100000,
      "pay_date": "2020-6-1",
      "pay_remark": "测试账单备注二"
    }
  ],
  "program_data": [
    {
      "program_id": null,
      "program_name": "测试节目一",
      "program_type": "tv",
      "episodes": 40,
      "investment_type": "purchase",
      "right_data": [
        {
          "right_type": "network",
          "right_remark": "测试权利类型备注一",
          "area_number": "010000",
          "area_remark": "测试区域备注一",
          "permanent_date": false,
          "start_date": "2019-3-1",
          "end_date": "2021-3-1",
          "date_remark": "测试时间备注一",
          "remark": "测试权利备注一"
        },
        {
          "right_type": "broadcast",
          "right_remark": "测试权利类型备注二",
          "area_number": "010000",
          "area_remark": "测试区域备注二",
          "permanent_date": false,
          "start_date": "2019-3-1",
          "end_date": "2021-3-1",
          "date_remark": "测试时间备注二",
          "remark": "测试权利备注二"
        },
        {
          "right_type": "publish",
          "right_remark": "测试权利类型备注三",
          "area_number": "010000",
          "area_remark": "测试区域备注三",
          "permanent_date": false,
          "start_date": "2019-3-1",
          "end_date": "2021-3-1",
          "date_remark": "测试时间备注三",
          "remark": "测试权利备注三"
        },
        {
          "right_type": "public",
          "right_remark": "测试权利类型备注四",
          "area_number": "010000",
          "area_remark": "测试区域备注四",
          "permanent_date": false,
          "start_date": "2019-3-1",
          "end_date": "2021-3-1",
          "date_remark": "测试时间备注四",
          "remark": "测试权利备注四"
        }
      ]
    }
  ]
}