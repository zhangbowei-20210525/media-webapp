import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootTemplateDto } from './dtos';


@Injectable({
  providedIn: 'root'
})
export class IpManagementService {

  constructor(
    protected http: HttpClient,
  ) { }

  setLeafNode(nodes: any[]) {
    for (const key in nodes) {
      if (nodes.hasOwnProperty(key)) {
        const element = nodes[key];
        if (!(element.children && element.children.length > 0)) {
          element.isLeaf = true;
        } else {
          this.setLeafNode(element.children);
        }
      }
    }
  }

  getCustomerOptions() {
    return this.http.get<any>('/api/v1/custom');
  }

  getCopyrightAreaOptions() {
    return this.http.get<RootTemplateDto[]>('/api/v1/ip/programs/template/area_numbers');
  }
}
