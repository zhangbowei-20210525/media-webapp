import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResultDto } from '@shared/dtos';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  sendCaptcha(phone: string) {
    return this.http.get<any>('/api/v1/sms', { params: { phone } });
  }

  loginByPhone(phone: string, code: string, invitation_id?: number) {
    return this.http.post<LoginResultDto>('/api/v1/login/phone', { phone, code, invitation_id }, { params: { _allow_anonymous: '' } });
  }
}
