import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseDto, PaginationDto, PaginationResponseDto } from '@shared';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TransmitService {

  public eventEmit: any;

  constructor(
    protected http: HttpClient,
  ) {
    this.eventEmit = new EventEmitter();
  }

  tapeFileList(id: number) {
    return this.http.get<any>(`/api/v1/sources/bought/${id}/files/brief`);
  }

  tapeDownloadInfo(id: number) {
    return this.http.get<any>(`/api/v1/sources/bought/${id}`);
  }

  getUploadRecord(id: number, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/${id}/task_groups/uploads?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getDownloadRecord(id: number, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/${id}/task_groups/downloads?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getPurchaseDownloadRecord(id: number, pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<any[]>>(`/api/v1/sources/bought/${id}/task_groups/downloads`, {
      params: {
        page: pagination.page as any,
        page_size: pagination.page_size as any
      }
    });
  }

  getTransmitSchedule(id: number) {
    return this.http.get<any>(`/api/v1/sources/tasks/groups/${id}/tasks`);
  }

  cancelDownloadTask(id: number) {
    return this.http.patch<any>(`/api/v1/sources/tasks/${id}`, {});
  }

  getPurTapeInfo(id: number) {
    return this.http.get<any>(`/api/v1/sources/bought/${id}`);
  }

  getPurTapeFile(id: number, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/bought/${id}/files?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  remoteValidation() {
    return this.http.get<any>(`/api/v1/hashlink/clients`);
  }

  private getId(id: number | number[]) {
    let rtn: string;
    if (Array.isArray(id)) {
      rtn = id.join(',');
    } else {
      rtn = id + '';
    }
    return rtn;
  }

  remoteDownloadTape(task_type: string, token: string, ids: number[]) {
    const id = this.getId(ids);
    return this.http.post<any>(`/api/v1/hashlink/clients/tasks`, { task_type: task_type, token: token, ids: id});
  }
}
