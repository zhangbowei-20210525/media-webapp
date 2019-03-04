import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseDto, PaginationDto, PaginationResponseDto } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class TransmitService {

  constructor(
    protected http: HttpClient,
  ) { }

  tapeFileList(id: number) {
    return this.http.get<any>(`/api/v1/sources/${id}/files`);
  }

  tapeDownloadInfo(id: number) {
    return this.http.get<any>(`/api/v1/bought_sources/${id}`);
  }

  DownloadTape(idArray: number[]) {
    return this.callHttpApp('download', { id: idArray, companyId: 0, auth_status: 0 });
}

getUploadRecord(id: number, pagination: PaginationDto) {
  return this.http.get<any>(`/api/v1/sources/${id}/task_groups/uploads?page=${pagination.page}&page_size=${pagination.page_size}`);
}

getDownloadRecord(id: number, pagination: PaginationDto) {
  return this.http.get<any>(`/api/v1/sources/${id}/task_groups/downloads?page=${pagination.page}&page_size=${pagination.page_size}`);
}

getPurchaseDownloadRecord(id: number, pagination: PaginationDto) {
  return this.http.get<PaginationResponseDto<any[]>>(`/api/v1/bought_sources/${id}/task_groups/downloads`, { params: {
    page: pagination.page as any,
    page_size: pagination.page_size as any
  }});
}

getTransmitSchedule(id: number) {
  return this.http.get<any>(`/api/v1/task_groups/${id}/tasks`);
}

cancelDownloadTask(id: number) {
  return this.http.patch<any>(`/api/v1/source_tasks/${id}`, {});
}

private callHttpApp(method: string, param: { id: number | number[], companyId: number, auth_status: number }) {
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
  const c = `&area_id=${param.companyId}&auth_status=${param.auth_status}`;
  return this.http.get(
      a + b + c
  );
}
}
