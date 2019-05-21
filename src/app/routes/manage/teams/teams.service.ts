import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DepartmentDto, CompanyDto } from './dtos';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(
    private http: HttpClient
  ) { }

  getCompanys() {
    return this.http.get<CompanyDto[]>('/api/v1/users/info/employees');
  }

  getCurrentCompany() {
    return this.http.get<CompanyDto>('/api/v1/auth/company');
  }

  addCompany(name: string, full_name: string, introduction: string) {
    return this.http.post<any>('/api/v1/companies', { name, full_name, introduction });
  }

  editCompany(name: string, full_name: string, introduction: string) {
    return this.http.post<any>('/api/v1/auth/company', { name, full_name, introduction });
  }

  switchCompany(employeeId: number) {
    return this.http.put<{ token: string, auth: any, permissions: any[] }>(`/api/v1/login/${employeeId}`, {});
  }

  getDepartments() {
    return this.http.get<DepartmentDto[]>('/api/v1/companies/departments');
  }

  addDepartment(master_department_id: string, name: string) {
    return this.http.post<any>('/api/v1/companies/departments', { master_department_id, name });
  }

  deleteDepartment(id: number | string) {
    return this.http.delete<any>(`/api/v1/companies/departments/${id}`);
  }
}
