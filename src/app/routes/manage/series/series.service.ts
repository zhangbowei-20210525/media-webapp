import { Injectable, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formData, PaginationDto, ResponseDto } from '@shared';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  eventEmit = new EventEmitter();

  constructor(
    protected http: HttpClient,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,
  ) { }

  // getUserSamples(pagination: PaginationDto) {
  //   return this.auth1.http.get<any>(`/api/v1/media/get_medialist_of_user?page=${pagination.page}&limit=${pagination.page_size}`);
  // }

  getUserSamplesOfSort(sort: string, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/media/get_medialist_of_user/${sort}?page=${pagination.page}&limit=${pagination.page_size}`);
  }

  changeStatus(contentId: number, status: boolean) {
    return this.http.post(
      '/api/v1/media/update_media_status', formData({ filmId: contentId, status: status ? 'publish' : 'private' }));
  }

  updateSubtitle(id: number, programId: number, frame_num: number, text: string) {
    return this.http.
      get(`/api/v1/media/edit_program_subtitle?series_id=${id}&program_id=${programId}&frame_num=${frame_num}&subtitle=${text}`);
  }

  updateField(id: number, key: string, value: string) {
    return this.http.get(`/api/v1/media/edit_series_info?series_id=${id}&field_key=${key}&field_value=${value}`);
  }

  interceptionVideo(id: number, programId: number,
    segment_start_num: number, startFrame: number, segment_end_num: number, endFrame: number) {
    return this.http.post<any>(`/api/v1/medias/add_segment/${id}/${programId}`,
      {
        segment_start_num: segment_start_num, segment_start_frame: startFrame,
        segment_end_num: segment_end_num, segment_end_frame: endFrame
      });
  }

  getSubsection(id: number, programId: number) {
    return this.http.get<any>(`/api/v1/medias/get_segment_list/${id}/${programId}`);
  }

  addSeriesInfo(newSeriesInfo: {
    name: string, nickname: string, program_type: string, theme: string, episode: number,
    introduction: string, director: string, screen_writer: string, protagonist: string, product_company: string, supervisor: string,
    general_producer: string, producer: string, release_date: string, language: string,
  }) {
    return this.http.post<any>('/api/v1/program', newSeriesInfo);
  }

  getSeries(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/program?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getSeriesDetailsInfo(id: number) {
    return this.http.get<any>(`/api/v1/program/${id}`);
  }

  deleteSeries(id: number) {
    return this.http.delete<any>(`/api/v1/program/${id}`);
  }

  getUploadVideoId(file: File) {
    const formdata = new FormData();
    formdata.append('file', file);
    return this.http.post<any>('/api/v1/upload/video', formdata);
  }

  getUploadImageId(file: File) {
    const formdata = new FormData();
    formdata.append('file', file);
    return this.http.post<any>('/api/v1/upload/image', formdata);
  }

  getUploadPdfId(file: File) {
    const formdata = new FormData();
    formdata.append('file', file);
    return this.http.post<any>('/api/v1/upload/document', formdata);
  }

  addUpload(publicity_id: number, material_id: number, material_type: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<any>(`/api/v1/publicity/${publicity_id}`, { material_id: material_id, material_type: material_type });
  }

  getPublicitiesList(id: number) {
    return this.http.get<any>('/api/v1/publicity', { params: { program_id: id + '' } });
  }

  getPublicitiesTypeList(pagination: PaginationDto, id: number, type: string) {
    return this.http.get<any>(`/api/v1/publicity/${id}/${type}?page=${pagination.page}&page_size=${pagination.page_size}`);
  }


  getPublicities(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/publicity?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  publicityDetail(id: number) {
    return this.http.get<any>(`/api/v1/publicity/${id}`);
  }

  // tslint:disable-next-line:max-line-length
  addTape(newTape: { program_id: number; name: string, language: string, subtitle: string, format: string, bit_rate: string, source_type: string, }) {
    return this.http.post<ResponseDto<number>>('/api/v1/sources', newTape);
  }

  // tslint:disable-next-line:max-line-length
  addEntityTape(newTape: { program_id: number; name: string, language: string, subtitle: string, source_type: string, episode: any, sharpness: any, carrier: any, brand: any, model: any, storage_date: any, storage_location: any, detail_location: any, sound_track: any }) {
    return this.http.post<ResponseDto<number>>('/api/v1/sources', newTape);
  }

  getTapeList(id: number) {
    return this.http.get<any>(`/api/v1/programs/${id}/sources`);
  }

  getOnlineInfo(id: number) {
    return this.http.get<any>(`/api/v1/sources/${id}`);
  }

  getAllTapes(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  tapeFileList(id: number, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/${id}/files?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getIpAddress() {
    return this.http.get<any>(`/api/v1/source_clients/ip`);
  }

  clientStatus(address: string) {
    return this.http.get<any>(`http://${address}/status`);
  }

  UploadTape(id: number, auth_status: number) {
    return this.callHttpApp('upload_public', { id: id, companyId: 0, auth_status: auth_status });
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

  getCompaniesName(phone: number) {
    return this.http.get<any>(`/api/v1/companies/search_by_phone?phone=${phone}`);
  }

  addPubTape(id: number, newTape: { auth_company_id: number }) {
    return this.http.post<ResponseDto<number>>(`/api/v1/sources/${id}/publish_auth`, newTape);
  }

  pubTapeList(id: number, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/${id}/publish_auth?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  deletePubTape(id: number, auth_company_id: number) {
    return this.http.delete<any>(`/api/v1/sources/${id}/publish_auth`, { params: { auth_company_id: auth_company_id as any } });
  }

  purchaseTapes(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/bought_sources?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getUserinfo(id: number) {
    return this.http.get<any>(`/api/v1/publicity/${id}`);
  }
}
