import { Injectable } from '@angular/core';
import { PaginationDto, PaginationResponseDto, formData } from '@shared';
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

  uploadFile(file: File) {
    return this.http.post<{ file_name: string }>('/api/v1/upload/common', formData({ file }));
  }

  getChoiceFields(file_name: string, contract_type: string) {
    return this.http.get<{ program_type: any[], theme: any[] }>
    ('/api/v1/rights/contracts/import/choice_fields', { params: { file_name, contract_type } });
  }

  importContracts(file_name: string, contract_type: string, program_type: any[], theme: any[]) {
    return this.http.post<{ contract_count: number, program_count: number }>
      ('/api/v1/rights/contracts/import', { file_name, contract_type, program_type, theme });
  }

  uploadImportFileMock(file: File) {
    return of({
      theme: [{ raw: '动画片', real: '动画片', count: 0 }, { raw: '动画', real: '动画', count: 0 }],
      program_type: [
        { raw: '战斗', real: '战斗', count: 0 },
        { raw: '战争', real: '战争', count: 0 },
        { raw: '动画', real: '动画', count: 0 },
        { raw: '动画片', real: '动画片', count: 0 },
        { raw: '电影', real: '电影', count: 0 },
        { raw: '电影1', real: '电影1', count: 0 },
        { raw: '微电影', real: '微电影', count: 0 },
        { raw: '网大', real: '网大', count: 0 },
        { raw: '网剧', real: '网剧', count: 0 },
        { raw: '网', real: '网', count: 0 }]
    }).pipe(delay(3000));
  }

  getImportTemplateFilePath(contract_type: string) {
    return this.http.get<{ file_url: string }>('/api/v1/rights/contracts/import/template_file', { params: { contract_type } });
  }
}
