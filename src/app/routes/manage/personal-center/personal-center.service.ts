import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseDto, dtoCatchError } from '@shared';
import { dtoMap } from '@shared';
import { PersonalCenterDto } from './personal-center.dto';

@Injectable({
  providedIn: 'root'
})
export class PersonalCenterService {

  constructor(
    private http: HttpClient
  ) { }

  getUserInfo() {
    return this.http.get<ResponseDto<PersonalCenterDto>>('/api/v1/users/info').pipe(dtoMap(e => e.data), dtoCatchError());
  }
}
