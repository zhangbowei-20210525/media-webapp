import { Injectable } from '@angular/core';
import { PaginationDto, PaginationResponseDto } from '@shared';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { delay, share, shareReplay, map, tap } from 'rxjs/operators';
import { ContractDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  constructor(private http: HttpClient) { }

  getContracts(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<any>>('/api/v1/contracts',
    { params: { page: pagination.page as any, page_size: pagination.page_size as any } });
  }

  getContractsMock(pagination: PaginationDto) {
    const mock$ = new BehaviorSubject({
      list: [{
        id: 1,
        code: 'BC-002198051',
        custom: '日本东京电视台',
        total_episodes: 132,
        episodes_price: 10000,
        total_episodes_price: 1320000,
        tape_mail_price: 100,
        total_tape_mail_price: 13200,
        amount: 1333200,
        charge_person: '立花泷',
        payment_method: 1
      }],
      pagination: { page: pagination.page, page_size: pagination.page_size, count: 1 }
    } as PaginationResponseDto<ContractDto>);
    return mock$.pipe(delay(500), tap(() => mock$.complete()), tap(() => mock$.unsubscribe()));
  }

  deleteContract(id: number) {
    return this.http.delete(`/api/v1/contracts/${id}`);
  }
}
