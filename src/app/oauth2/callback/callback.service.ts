import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResultDto } from '@shared/dtos';

@Injectable({
  providedIn: 'root'
})
export class CallbackService {

  constructor(
    private http: HttpClient
  ) { }

  loginByWechatCode(code: string) {
    return this.http.post<LoginResultDto>('/api/v1/login/wechat', { code }, { params: { _allow_anonymous: '' } });
  }

  bindingWechatByCode(code: string) {
    return this.http.post<LoginResultDto>('/api/v1/users/info/login/wechat', { code });
  }
}
