import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
、

@Injectable({
  providedIn: 'root'
})
export class IpManagementService {

  constructor(
    protected http: HttpClient,
  ) { }

  getCustomerOptions() {
    return this.http.get<any>('/api/v1/custom');
  }
}
