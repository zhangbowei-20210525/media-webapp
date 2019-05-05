import { Injectable } from '@angular/core';
import { PaginationDto, PaginationResponseDto } from '@shared';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { delay, share, shareReplay, map, tap } from 'rxjs/operators';
import { ContractDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  constructor(private http: HttpClient) { }

  getProcurementContracts(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<ContractDto>>('/api/v1/rights/contracts?contract_type=purchase',
    { params: { page: pagination.page as any, page_size: pagination.page_size as any } });
  }

  getPublishedContracts(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<ContractDto>>('/api/v1/rights/contracts?contract_type=publish',
    { params: { page: pagination.page as any, page_size: pagination.page_size as any } });
  }

  // getContractsMock(pagination: PaginationDto) {
  //   return of({
  //     list: [{
  //       id: 1,
  //       contract_number: 'BC-002198051',
  //       custom_name: '日本东京电视台',
  //       total_episodes: 132,
  //       episode_price: 10000,
  //       total_episodes_price: 1320000,
  //       tape_mail_price: 100,
  //       total_tape_mail_price: 13200,
  //       total_amount: 1333200,
  //       charge_person: '立花泷',
  //       paid_amount: 1
  //     }],
  //     pagination: { page: pagination.page, page_size: pagination.page_size, count: 1 }
  //   } as PaginationResponseDto<ContractDto>).pipe(delay(500));
  // }

  deleteContract(id: number) {
    return this.http.delete(`/api/v1/rights/contracts/${id}`);
  }
}
