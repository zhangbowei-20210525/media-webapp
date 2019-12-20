import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InternetCompanyInvitationService {

  constructor(
    private http: HttpClient
  ) { }

  getInvitingCompanyInfo(id: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`/api/v1/companies/connections/invitations/share/info?employee_id=${id}`, { params: { _allow_anonymous: '' } });
  }

  getAuthenticationInfo() {
    return this.http.get<any>('/api/v1/companies/certifications');
  }

  getCompanys() {
    return this.http.get<any>('/api/v1/users/info/employees');
  }

  switchCompany(employeeId: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.put<{ token: string, auth: any, permissions: any[] }>(`/api/v1/login/${employeeId}`, {});
  }

  agreeInvitation(invited_company_id: number, invited_employee_id: number, remark: string) {
    return this.http.post<any>('/api/v1/companies/connections/invitations', {
      invited_company_id,
      invited_employee_id,
      remark
    });
  }
}
