import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationResponseDto } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(
    private http: HttpClient
  ) { }

  getEmployees(department_id: any, page_size?: any, page?: any) {
    return this.http.get<PaginationResponseDto<any>>('/api/v1/employees', { params: { department_id, page_size, page } });
  }

  addEmployee(department_id: string, name: string, phone: string) {
    return this.http.post<any>('/api/v1/employees', { department_id, name, phone });
  }

  deleteEmployees(employee_ids: string[]) {
    return this.http.post<any>('/api/v1/employees/batch_delete', { employee_ids });
  }
}
