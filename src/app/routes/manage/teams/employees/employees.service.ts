import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationResponseDto } from '@shared';
import { RoleDto } from '../roles/dtos';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployees(department_id: any, page_size?: any, page?: any) {
    return this.http.get<PaginationResponseDto<any>>('/api/v1/companies/employees', { params: { department_id, page_size, page } });
  }

  addEmployee(department_id: number, name: string, phone: string, roles: number[]) {
    return this.http.post<any>('/api/v1/companies/employees', { department_id, name, phone, roles });
  }

  deleteEmployees(employee_ids: string[]) {
    return this.http.post<any>('/api/v1/companies/employees/batch_delete', { employee_ids });
  }

  getRoles() {
    return this.http.get<RoleDto[]>('/api/v1/companies/roles');
  }
}
