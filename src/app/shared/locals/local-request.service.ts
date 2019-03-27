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
  }

//   getUploadFoldersName (address: string) {
//     return this.http.get<any>(`http://${address}/get_dirs`, &token=${this.getToken()});
// }

DownloadTape(idArray: number[]) {
  return this.callHttpApp('download', { id: idArray});
}

UploadTape(id: number) {
  return this.callHttpApp('upload_public', { id: id });
}

private callHttpApp(method: string, param: { id: number | number[]}) {
  function isArray(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
  }
  let string$;
  if (isArray(param.id)) {
      const idArr = param.id as number[];
      string$ = idArr.join(',');
  } else {
      string$ = param.id;
  }
  const a = 'http://127.0.0.1:8756/add_task?';
  const b = `type=${method}&ids=${string$}`;
  const c = `&token=${this.getToken()}`;
  return this.http.get(`http://127.0.0.1:8756/add_task?type=${method}&ids=${string$}&token=${this.getToken()}`, { params: { _allow_anonymous: '', _allow_no_language: '' }});
}
}
