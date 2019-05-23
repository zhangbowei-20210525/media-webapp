import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule } from '@angular/common/http';
import { ResponseDto } from '@shared';

interface LoginResultDto { [key: string]: any; token: string; auth: any; permissions: any[]; }

@Injectable({
  providedIn: 'root'
})
export class PubAuthorizationReceiveService {

  constructor(
    protected http: HttpClient,
  ) { }

  getAuthorizationInfo() {
    return this.http.get<any>(`/api/v1/sources/auth/receipt`);
  }

  pubAuth(id: number, newCompany: { status: boolean,  company_name: string, company_full_name: string}) {
    return this.http.patch<any>(`/api/v1/sources/auth/receipt/${id}`, newCompany);
  }

  switchCompany(employeeId: number) {
    return this.http.put<LoginResultDto>(`/api/v1/login/${employeeId}`, {});
  }
}
