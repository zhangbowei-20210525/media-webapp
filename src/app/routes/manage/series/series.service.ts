import { Injectable, EventEmitter, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule } from '@angular/common/http';
import { formData, PaginationDto, ResponseDto, PaginationResponseDto } from '@shared';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  public eventEmit: any;

  constructor(
    protected http: HttpClient,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,
  ) {
    this.eventEmit = new EventEmitter();
  }

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

  editSeriesInfo(id: number, newSeriesInfo: {
    name: string, nickname: string, program_type: string, theme: string, episode: number,
    introduction: string, director: string, screen_writer: string, protagonist: string, product_company: string, supervisor: string,
    general_producer: string, producer: string, release_date: string, language: string,
  }) {
    return this.http.put<any>(`/api/v1/program/${id}`, newSeriesInfo);
  }

  addSeries(newSeriesInfo: {
    name: string, program_type: string
  }) {
    return this.http.post<any>('/api/v1/program', newSeriesInfo);
  }

  fuzzySearch(name: string ) {
    return this.http.get<any>(`/api/v1/programs/brief?q=${name}`);
  }

  getSeries(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/program?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getSearchSeries(search: any, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/program?q=${search}&page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getSeriesDetailsInfo(id: number) {
    return this.http.get<any>(`/api/v1/program/${id}`);
  }

  deleteSeries(id: number) {
    return this.http.delete<any>(`/api/v1/program/${id}`);
  }

  deleteTape(id: number) {
    return this.http.delete<any>(`/api/v1/sources/${id}`);
  }

  deletePublicity(pid: number, type: string, id: number) {
    return this.http.delete<any>(`/api/v1/publicity/${pid}/${type}/${id} `);
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
    return this.http.get<PaginationResponseDto<any[]>>('/api/v1/publicity', { params: pagination as any});
  }

  getSearchPublicities(search: any, pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<any[]>>(`/api/v1/publicity?q=${search}`, { params: pagination as any});
  }

  publicityDetail(id: number) {
    return this.http.get<any>(`/api/v1/publicity/${id}`);
  }

  // tslint:disable-next-line:max-line-length
  addTape(newTape: { program_id: number; name: string, language: string, subtitle: string, remark: string, source_type: string, }) {
    return this.http.post<ResponseDto<number>>('/api/v1/sources', newTape);
  }

  // tslint:disable-next-line:max-line-length
  editTape(id: number, newTape: { name: string, language: string, subtitle: string, remark: string, source_type: string, }) {
    return this.http.put<ResponseDto<number>>(`/api/v1/sources/${id}`, newTape);
  }

  // tslint:disable-next-line:max-line-length
  addTape1(newTape: {  program_name: string, program_type: string, name: string, language: string, subtitle: string, remark: string, source_type: string, }) {
    return this.http.post<ResponseDto<number>>('/api/v1/sources', newTape);
  }
  // tslint:disable-next-line:max-line-length
  addEntityTape(newTape: { program_id: number; name: string, language: string, subtitle: string, source_type: string, episode: any, sharpness: any, carrier: any, brand: any, model: any, storage_date: any, storage_location: any, detail_location: any, sound_track: any }) {
    return this.http.post<ResponseDto<number>>('/api/v1/sources', newTape);
  }

  // tslint:disable-next-line:max-line-length
  editEntityTape(id: number, newTape: { name: string, language: string, subtitle: string, source_type: string, episode: any, sharpness: any, carrier: any, brand: any, model: any, storage_date: any, storage_location: any, detail_location: any, sound_track: any }) {
    return this.http.put<ResponseDto<number>>(`/api/v1/sources/${id}`, newTape);
  }

  // tslint:disable-next-line:max-line-length
  addEntityTape1(newTape: {  program_name: string, program_type: string, name: string, language: string, subtitle: string, source_type: string, episode: any, sharpness: any, carrier: any, brand: any, model: any, storage_date: any, storage_location: any, detail_location: any, sound_track: any }) {
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

  getSearchAllTapes(search: any, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources?q=${search}&page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  tapeFileList(id: number, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/${id}/files?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getIpAddress() {
    return this.http.get<any>(`/api/v1/source_clients/ip`);
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

  getTwoDimensionalCode(id: number) {
    return this.http.get<any>(`/api/v1/wechat/share_code/${id}`);
  }

  shareEmail(email: string, url: string, publicity_name: string, sid: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`/api/v1/email/share`, { params: { email, url, publicity_name, sid: sid as any} });
  }

  getThumbnail(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/publicity/card?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getSearchThumbnail(search: any, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/publicity/card?q=${search}&page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getCompanies() {
    return this.http.get<any>(`/api/v1/users/info/employees`);
  }

  getCarrierBrand() {
    return this.http.get<any>(`/api/v1/sources/template/brand`);
  }

  getCarrierModel() {
    return this.http.get<any>(`/api/v1/sources/template/model`);
  }
}
