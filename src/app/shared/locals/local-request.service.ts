import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class LocalRequestService {

  constructor(
    private http: HttpClient,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService
  ) { }

  private getToken() {
    return this.token.get().token;
  }

  status(address: string, port: string) {
    return this.http.get(`http://${address}:${port}/status`, { params: { _allow_anonymous: '' } });
  }
}
