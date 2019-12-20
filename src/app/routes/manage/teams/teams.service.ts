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

  getAuthenticationInfo() {
    return this.http.get<any>('/api/v1/companies/certifications');
  }

  addAuthentication(data) {
    return this.http.post<any>('/api/v1/companies/certifications', {
      full_name: data.full_name,
      name: data.name,
      business_license_image: data.business_license_image,
      apply_username: data.apply_username,
      apply_phone: data.apply_phone,
      introduction: data.introduction,
    });
  }

  getInternetCompanyInvitationUrl() {
    return this.http.get<any>('/api/v1/companies/connections/invitations/share');
  }

  getInterconnectionNotApprovedInfo() {
    return this.http.get<any>('/api/v1/companies/connections/invitations');
  }

  isExamine() {
    return this.http.get<any>('/api/v1/companies/connections/invitations/exists');
  }

  auditOperation(id: number, status: boolean) {
    return this.http.post<any>(`/api/v1//companies/connections/invitations/${id}/result`, { status });
  }

  getInternetCompanies() {
    return this.http.get<any>('/api/v1/companies/connections');
  }

  getContacts(id: number) {
    return this.http.get<any>(`/api/v1/companies/connections/${id}/liaisons`);
  }
}
