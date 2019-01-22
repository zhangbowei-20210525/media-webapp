import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(
    private http: HttpClient
  ) { }

  getDepartments() {
    return this.http.get('/api/v1/departments');
  }

  addDepartment(master_department_id: string, name: string) {
    return this.http.post('/api/v1/departments', { master_department_id, name });
  }
}
