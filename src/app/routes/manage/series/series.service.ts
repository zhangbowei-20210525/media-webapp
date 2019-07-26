import { Injectable, EventEmitter, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule } from '@angular/common/http';
import { formData, PaginationDto, ResponseDto, PaginationResponseDto } from '@shared';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { tap } from 'rxjs/operators';
import { CacheService, CacheType } from '@core/cache';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(
    private cache: CacheService,
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
    segment_start_num: number, segment_start_frame: number, segment_end_num: number, endFrame: number) {
    return this.http.post<any>(`/api/v1/medias/add_segment/${id}/${programId}`,
      {
        segment_start_num, segment_start_frame,
        segment_end_num, segment_end_frame: endFrame
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

  fuzzySearch(name: string) {
    return this.http.get<PaginationResponseDto<any>>(`/api/v1/programs/brief?q=${name}`);
  }

  getSeries(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/program?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  searchSeries(search: string, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/program?q=${search}&page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getSeriesDetailsInfo(id: number) {
    return this.http.get<any>(`/api/v1/program/${id}`);
  }
  // 获取意向基本信息
  getDetailsInfo(id: number) {
    return this.http.get<any>(`/api/v1/pub/program/${id}`);
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
  // 获取意向类型数据
  getPubDetialsTypeList(pagination: PaginationDto, id: number, type: string) {
    return this.http.get<any>(`/api/v1/pub/publicity/${id}/${type}?page=${pagination.page}&page_size=${pagination.page_size}`);
  }
  getPublicities(pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<any[]>>('/api/v1/publicity', { params: pagination as any });
  }

  searchPublicities(search: any, pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<any[]>>(`/api/v1/publicity?q=${search}`, { params: pagination as any });
  }

  publicityDetail(id: number) {
    return this.http.get<any>(`/api/v1/publicity/${id}`);
  }
  pubDetail(id: number) {
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
  addTape1(newTape: { program_name: string, program_type: string, name: string, language: string, subtitle: string, remark: string, source_type: string, }) {
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
  addEntityTape1(newTape: { program_name: string, program_type: string, name: string, language: string, subtitle: string, source_type: string, episode: any, sharpness: any, carrier: any, brand: any, model: any, storage_date: any, storage_location: any, detail_location: any, sound_track: any }) {
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

  searchAllTapes(search: any, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources?q=${search}&page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  tapeFileList(id: number, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/${id}/files?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getIpAddress() {
    return this.http.get<any>(`/api/v1/sources/client/ip`);
  }

  getCompaniesName(phone: number) {
    return this.http.get<any>(`/api/v1/companies/search_by_phone?phone=${phone}`);
  }

  addPubTape(id: number, newTape: { custom_name: string, liaison_name: string, liaison_phone: string, liaison_id: string }) {
    return this.http.post<ResponseDto<number>>(`/api/v1/sources/${id}/publish_auth`, newTape);
  }

  pubTapeList(id: number, pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/${id}/publish_auth?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  deletePubTape(id: number, auth_company_id: number) {
    return this.http.delete<any>(`/api/v1/sources/${id}/publish_auth`, { params: { auth_company_id: auth_company_id as any } });
  }

  purchaseTapes(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/sources/bought?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  getUserinfo(id: number) {
    return this.http.get<any>(`/api/v1/publicity/${id}`);
  }

  getTwoDimensionalCode(id: number) {
    return this.http.get<any>(`/api/v1/wechat/share_code/${id}`);
  }

  shareEmail(email: string, url: string, publicity_name: string, sid: number) {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`/api/v1/email/share`, { params: { email, url, publicity_name, sid: sid as any } });
  }

  getThumbnail(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/publicity/card?page=${pagination.page}&page_size=${pagination.page_size}`);
  }

  searchThumbnail(search: string, pagination: PaginationDto) {
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

  requestProgramTypes() {
    return this.http.get<{ program_type_choices: string[], theme_choices: string[] }>('/api/v1/programs/template');
    // .pipe(tap(data => this.cache.set(CacheType.PROGRAM_TYPE, data)));
  }

  getProgramTypes() {
    // return this.cache.isCold(CacheType.PROGRAM_TYPE) ? this.requestProgramTypes() : of(this.cache.get(CacheType.PROGRAM_TYPE));
    return this.requestProgramTypes();
  }

  getCompanyList() {
    return this.http.get<any>(`/api/v1/customs/brief`);
  }

  getContacts(id: number) {
    return this.http.get<any>(`/api/v1/custom/${id}/liaison`);
  }
  // 删除在线存储
  deleteOnlineStorage(id: number) {
    return this.http.delete<any>(`/api/v1/sources/${id}/files/hashlink`);
  }
  // 删除在线和本地存储当前行
  deleteTapeSave(id: number) {
    return this.http.delete<any>(`/api/v1/sources/files/${id}`);
  }
  // 获取审片工作视图接口
  getReviewView(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/reviews/tasks?page=${pagination.page}&page_size=${pagination.page_size}`);
  }
  // 获取审片列表接口
  getIntentionTypeList(pagination: PaginationDto, companyId: any, receiverId: any) {
    return this.http.get<any>(`/api/v1/reviews/intentions?page=${pagination.page}&page_size=${pagination.page_size}`, {
      params: {
        publish_company_id: companyId,
        receive_employee_id: receiverId
      }
    }
    );
  }
  // 宣发分享授权
  getSharingAuthorization(liaison_ids: any, publicityId: any) {
    return this.http.post<ResponseDto<number>>(`/api/v1/publicity/share`,
      { liaison_ids: liaison_ids, publicity_id: publicityId }
    );
  }
  // 生成样片征集令
  getSampleCollection(program_type: any, program_theme: any, description) {
    return this.http.post<any>(`/api/v1/publicity/collections`, { program_type: program_type, program_theme: program_theme, description });
  }
  // 我的征集令
  getBrowseRecord(pagination: PaginationDto) {
    return this.http.get<any>(`/api/v1/publicity/collections?page=${pagination.page}&page_size=${pagination.page_size}`);
  }
  // 节目类型
  programType() {
    return this.http.get<any>(`/api/v1/programs/template`);
  }
  // 征集令提交
  submitCollection(program: any, id: any) {
    return this.http.post<any>(`/api/v1/publicity/collections/${id}/reports`, program);
  }
  // 征集令表单
  getSamplePublicitys() {
    return this.http.get<any>(`/api/v1/publicitys`);
  }
  // 获取审片列表
  getReviewList(pagination: PaginationDto, selectedIndex: any,
    companyId: any, receiverId: any, sortValue: any, starTime: any, endTime: any) {
    return this.http.get<any>(`/api/v1/reviews?page=${pagination.page}&page_size=${pagination.page_size}`, {
      params: {
        step_number: selectedIndex,
        publish_company_id: companyId,
        receive_employee_id: receiverId,
        order_by: sortValue,
        created_at__gte: starTime,
        created_at__lte: endTime,
      }
    });
  }
  // 一审提交
  submitFirstInstance(review_ids: any) {
    return this.http.post<any>(`/api/v1/reviews/results`, {
      review_ids: review_ids,
    });
  }
  // 一审详情提交
  // submitFirstInstanceDetails(conclusion: boolean, scoring: any, comment: any, id: number) {
  //   return this.http.post<any>(`/reviews/${id}/records`, {
  //     conclusion: conclusion,
  //     scoring: scoring,
  //     comment: comment,
  //   });
  // }

  // 二审详情提交
  // submitSecondInstanceDetails(conclusion: boolean, scoring: any, comment: any, id: number) {
  //   return this.http.post<any>(`reviews/${id}/records`, {
  //     conclusion: conclusion,
  //     scoring: scoring,
  //     comment: comment,
  //   });
  // }

  // 三审详情提交
  submitThreeInstanceDetails(conclusion: number, scoring: any, comment: any, reviewId: number) {
    return this.http.post<any>(`/api/v1/reviews/records`, {
      review_step_id: reviewId,
      conclusion: conclusion,
      scores: scoring,
      comment: comment,
    });
  }
  // 获取审片详情
  getReviewDetails(id: number) {
    return this.http.get<any>(`/api/v1/reviews/${id}`);
  }
  // 新建审片
  creatReview(intention_ids) {
    return this.http.post<any>(`/api/v1/reviews`, {
      intention_ids,
    });
  }

  getSolicitationDetails(id: number) {
    return this.http.get<any>(`/api/v1/publicity/collections/${id}`, { params: { _allow_anonymous: '' } });
  }

  getAcceptEmployeeEnvitationsInfo(id: number) {
    return this.http.get<any>(`/api/v1/companies/employees/${id}/invitation`, { params: { _allow_anonymous: '' } });
  }
  // 拉取视频信息
  getPublicityVideo(id: number) {
    return this.http.get<any>(`/api/v1/publicitys/${id}/materials`);
  }
  // 发起审片限制
  sendView() {
    return this.http.get<any>(`/api/v1/reviews/configs/status`);
  }

  getTypes(type: string) {
    return this.http.get<any>(`/api/v1/programs/configs/fields/${type}`);
  }

  addType(type: string, field_value: string) {
    return this.http.post<any>(`/api/v1/programs/configs/fields/${type}`, {
      field_value,
    });
  }

  typeMerge(type: string, id: number, field_value: string) {
    return this.http.put<any>(`/api/v1/programs/configs/fields/${type}/${id}`, { field_value });
  }

  deleteType(type: string, id: number) {
    return this.http.delete<any>(`/api/v1/programs/configs/fields/${type}/${id}`);
  }

  getScreenList() {
    return this.http.get<any>(`/api/v1/reviews/intentions/template/filter`);
  }
}
