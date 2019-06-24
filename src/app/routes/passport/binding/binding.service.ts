import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResultDto } from '@shared/dtos';

// tslint:disable:variable-name

@Injectable({
  providedIn: 'root'
})
export class BindingService {

  constructor(
    private http: HttpClient
  ) { }

  sendCaptcha(phone: string) {
    return this.http.get<any>('/api/v1/sms', { params: { phone } });
  }

  bindingPhone(token: string, phone: string, code: string) {
    return this.http.post<LoginResultDto>(
      '/api/v1/users/info/login/phone', { phone, code }, { headers: { token }, params: { _allow_anonymous: '' } });
  }

  bindingCompany(token: string, nickname: string, name: string, full_name: string) {
    return this.http.post<LoginResultDto>(
      '/api/v1/auth/company/init', { nickname, name, full_name }, { headers: { token }, params: { _allow_anonymous: '' } });
  }
}
