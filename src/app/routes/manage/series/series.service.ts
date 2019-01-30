import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationDto } from 'src/app/shared/dtos/pagination.dto';
import { ResponseDto } from 'src/app/shared/dtos/response.dto';
import { toFormData } from 'src/app/helpers/request.helper';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  eventEmit: any;

  constructor(
    protected http: HttpClient,
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
      '/api/v1/media/update_media_status', toFormData({ filmId: contentId, status: status ? 'publish' : 'private' }));
  }

  updateSubtitle(id: number, programId: number, frame_num: number, text: string) {
    return this.http.
    get(`/api/v1/media/edit_program_subtitle?series_id=${id}&program_id=${programId}&frame_num=${frame_num}&subtitle=${text}`);
  }
  updateField(id: number, key: string, value: string) {
    return this.http.get(`/api/v1/media/edit_series_info?series_id=${id}&field_key=${key}&field_value=${value}`);
  }

  interceptionVideo(id: number, programId: number,
    segment_start_num: number, startFrame: number, segment_end_num: number , endFrame: number) {
    return this.http.post<ResponseDto<any>>(`/api/v1/medias/add_segment/${id}/${programId}`,
    { segment_start_num: segment_start_num, segment_start_frame: startFrame,
      segment_end_num: segment_end_num, segment_end_frame: endFrame});
  }

  getSubsection(id: number, programId: number) {
    return this.http.get<ResponseDto<any>>(`/api/v1/medias/get_segment_list/${id}/${programId}`);
  }

  addSeriesInfo(newSeriesInfo: { name: string, nickname: string, program_type: string, theme: string, episode: number,
    introduction: string, director: string, screen_writer: string, protagonist: string, product_company: string, supervisor: string,
    general_producer: string, producer: string, release_date: string, language: string, }) {
      return this.http.post<ResponseDto<any>>('/api/v1/program', newSeriesInfo);
  }

  getSeries(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/program?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getSeriesDetailsInfo(id: number) {
    return this.http.get<any>(`/api/v1/program/${id}`);
  }

  deleteSeries(id: number) {
    return this.http.delete<ResponseDto<any>>(`/api/v1/program/${id}`);
  }

  getUploadVideoId(file: File) {
    const formdata = new FormData();
    formdata.append('file', file);
    return this.http.post<ResponseDto<any>>('/api/v1/upload/video', formdata);
  }

  getUploadImageId(file: File) {
    const formdata = new FormData();
    formdata.append('file', file);
    return this.http.post<ResponseDto<any>>('/api/v1/upload/image', formdata);
  }

  getUploadPdfId(file: File) {
    const formdata = new FormData();
    formdata.append('file', file);
    return this.http.post<ResponseDto<any>>('/api/v1/upload/document', formdata);
  }

  addUpload(publicity_id: number, material_id: number, material_type: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.post<ResponseDto<any>>(`/api/v1/publicity/${publicity_id}`, { material_id: material_id, material_type: material_type});
  }

  getPublicitiesList(id: number) {
    return this.http.get<any>('/api/v1/publicity', { params: { program_id: id + '' }});
  }

  getPublicitiesTypeList(pagination: PaginationDto, id: number, type: string) {
    return this.http.get<any>(`/api/v1/publicity/${id}/${type}?page=${pagination.page}&page_size=${pagination.page_size}`);
  }


  getPublicities(pagination: PaginationDto) {
    return this.http.get<any>(`api/v1/publicity?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  publicityDetail(id: number) {
    return this.http.get<any>(`/api/v1/publicity/${id}`);
  }

}
