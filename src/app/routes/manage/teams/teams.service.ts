import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DepartmentDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(
    private http: HttpClient
  ) { }

  getCompanys() {
    return this.http.get<any>('/api/v1/users/info/employees');
  }

  addCompany(name: string, full_name: string, introduction: string) {
    return this.http.post<any>('/api/v1/companies', { name, full_name, introduction });
  }

  switchCompany(employeeId: number) {
    return this.http.put<any>(`/api/v1/login/${employeeId}`, {});
  }

  getDepartments() {
    return this.http.get<DepartmentDto[]>('/api/v1/departments');
  }

  addDepartment(master_department_id: string, name: string) {
    return this.http.post<any>('/api/v1/departments', { master_department_id, name });
  }

  deleteDepartment(id: number | string) {
    return this.http.delete<any>(`/api/v1/departments/${id}`);
  }
}
