import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootTemplateDto, OrderPayDto, CopyrightDto, ProgramDto, AddCopyrightsDto, ContractDto } from './dtos';
import { ReactiveBase, ReactiveDatePicker, ReactiveTextbox, PaginationDto } from '@shared';


@Injectable({
  providedIn: 'root'
})
export class IpManagementService {

  constructor(
    protected http: HttpClient,
  ) { }

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

  toOrderData(pay_amount: number, pay_date: string, pay_remark: string) {
    return {
      pay_amount,
      pay_date,
      pay_remark
    } as OrderPayDto;
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


  toProgramData(name: string, category: string, author: string,
    rights: CopyrightDto[]) {
    return {
      name,
      category,
      author,
      rights
    } as ProgramDto;
  }

  toCopyrightData(right_type: string, right_remark: string, area_number: string, area_remark: string,
    permanent_date: boolean, start_date: string, end_date: string, date_remark: string, remark: string) {
    return {
      right_type,
      right_remark,
      area_number,
      area_remark,
      permanent_date,
      start_date,
      end_date,
      date_remark,
      remark,
    } as unknown as CopyrightDto;
  }

  getCustomerOptions() {
    return this.http.get<any>('/api/v1/custom');
  }

  getCopyrightAreaOptions() {
    return this.http.get<RootTemplateDto[]>('/api/v1/ip/programs/template/area_numbers');
  }


  toAddCopyrightsData(contract: ContractDto, orders: OrderPayDto[], programs: ProgramDto[]) {
    return {
      contract,
      orders,
      programs
    } as AddCopyrightsDto;
  }

  addIp(copyrightData: AddCopyrightsDto) {
    return this.http.post('/api/v1/ip/contracts', copyrightData);
  }

  getProjectName() {
    return this.http.get<any>('/api/v1/ip/programs/brief');
  }

  getIpRight(pagination: PaginationDto, params: any) {
    return this.http.get<any>(`/api/v1/ip/programs?page=${pagination.page}&page_size=${pagination.page_size}`,
      {
        params: {
          category: params.type,
          area_number: params.area_number,
          right_type: params.right_type,
          start_date: params.start_date,
          end_date: params.end_date,
          q: params.q
        }
      });
  }

  deleteCopyrights(pid: number) {
    return this.http.delete(`/api/v1/ip/programs/${pid}`);
  }

  getIpInfo(id: number) {
    return this.http.get<any>(`/api/v1/ip/programs/${id}`);
  }
}
