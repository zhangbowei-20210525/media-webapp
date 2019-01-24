import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseDto, ListResponseDto, dtoMap, dtoCatchError } from '@shared';
import { DepartmentDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(
    private http: HttpClient
  ) { }

  getCompanys() {
    return this.http.get<ResponseDto<any>>('/api/v1/users/info/employees');
  }

  addCompany(name: string, full_name: string, introduction: string) {
    return this.http.post<ResponseDto<any>>('/api/v1/companies', { name, full_name, introduction });
  }

  switchCompany(employeeId: number) {
    return this.http.put<ResponseDto<any>>(`/api/v1/login/${employeeId}`, {});
  }

  getDepartments() {
    return this.http.get<ResponseDto<DepartmentDto[]>>('/api/v1/departments');
  }

  addDepartment(master_department_id: string, name: string) {
    return this.http.post<ResponseDto<any>>('/api/v1/departments', { master_department_id, name });
  }

  deleteDepartment(id: number | string) {
    return this.http.delete<ResponseDto<any>>(`/api/v1/departments/${id}`);
  }
}
