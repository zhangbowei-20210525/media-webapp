import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseDto } from '@shared';
import { of } from 'rxjs';
import { EmployeeDetailsDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployeeDetails(id: string) {
    return this.http.get<ResponseDto<any>>(`/api/v1/employees/${id}`);
  }

  getEmployeeDetailsMock(id: string) {
    return of(this.okResponse({
      name: 'Jing Liu',
      phone: '15710171696',
      isActivated: false,
      departments: [{
        id: 1,
        name: '销售部'
      },
      {
        id: 2,
        name: '法务部'
      }]
    } as EmployeeDetailsDto));
  }

  okResponse<T>(data: T) {
    return {
      code: 0,
      detail: '',
      message: 'ok',
      data: data
    } as ResponseDto<T>;
  }
}
