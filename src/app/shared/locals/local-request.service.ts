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

  status(address: string) {
    return this.http.get(`http://${address}/status`, { params: { _allow_anonymous: '', _allow_no_language: '' } });
    // return this.jsonpCallHttpAppStatus(address);
  }

  //   getUploadFoldersName (address: string) {
  //     return this.http.get<any>(`http://${address}/get_dirs`, &token=${this.getToken()});
  // }

  downloadTape(idArray: number[]) {
    return this.callHttpApp('download', { id: idArray });
    // return this.jsonpCallHttpApp('127.0.0.1:8756', 'download', { id: idArray });
  }

  uploadTape(id: number) {
    return this.callHttpApp('upload_public', { id: id });
    // return this.jsonpCallHttpApp('127.0.0.1:8756', 'upload_public', { id });
  }

  private callHttpApp(action: string, data: { id: number | number[] }) {
    let id;
    if (Array.isArray(data.id)) {
      const idArr = data.id as number[];
      id = idArr.join(',');
    } else {
      id = data.id;
    }
    return this.http.get(`http://127.0.0.1:8756/add_task?type=${action}&ids=${id}&token=${this.getToken()}`,
      { params: { _allow_anonymous: '', _allow_no_language: '' } });
  }

  private jsonpCallHttpAppStatus(address: string) {
    return this.http.jsonp(`http://${address}/status`, 'callback');
  }

  private jsonpCallHttpApp(address: string, action: string, data: { id: number | number[] }) {
    let id;
    if (Array.isArray(data.id)) {
      id = data.id.join(',');
    } else {
      id = data.id;
    }
    return this.http.jsonp(`http://${address}/AddTask?type=${action}&ids=${id}&token=${this.getToken()}`, 'callback');
  }
}
