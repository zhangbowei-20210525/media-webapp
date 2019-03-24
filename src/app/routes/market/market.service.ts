import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarketDetailsDto } from './dtos/market-details.dto';
import { PaginationDto } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  eventEmit: any;

  constructor(
    protected http: HttpClient,
  ) {
    this.eventEmit = new EventEmitter();
  }

//   getMediaSamples(pagination: PaginationDto) {
//       return this.http.get<any>(`/api/v1/medias/test/tv?page=${pagination.page}&limit=${pagination.page_size}`);
//   }

//   getAllMedia(pagination: PaginationDto, search: string) {
//       return this.http.get<any>(`/api/v1/medias/test/all?page=${pagination.page}&limit=${pagination.page_size}&search=${search}`);
//   }

//  getCompanyMedia(id: number, pagination: PaginationDto, sort: string) {
//     return this.http.get<any>
//     (`/api/v1/medias/get_medialist_of_employer/${id}/${sort}?page=${pagination.page}&limit=${pagination.page_size}`);
//   }

//   getCollectMedias(pagination: PaginationDto, sort: string) {
//     return this.http.get<any>
//     (`/api/v1/medias/get_medialist_of_favorite/${sort}?page=${pagination.page}&limit=${pagination.page_size}`);
//   }

//   getMovies(pagination: PaginationDto) {
//       return this.http.get<any>(`/api/v1/medias/test/film?page=${pagination.page}&limit=${pagination.page_size}`);
//   }

//   getVariety(pagination: PaginationDto) {
//       return this.http.get<any>(`/api/v1/medias/test/variety?page=${pagination.page}&limit=${pagination.page_size}`);
//   }

//   getOther(pagination: PaginationDto) {
//       return this.http.get<any>(`/api/v1/medias/test/other?page=${pagination.page}&limit=${pagination.page_size}`);
//   }

//   getMediaDetail(mediaId: number, programId: number) {
//       return this.http.get<MarketDetailsDto>(`/api/v1/media/get_series_detail?series_id=${mediaId}&program_id=${programId}`);
//   }

// //   getTypeFixationDetail(id: number) {
// //       return this.http.get<ResponseDto<MarketDetailsDto>>(`/api/v1/medias/test/get_series_detail/${id}`);
// //   }

//   getTypeInfoDetail(programId: number) {
//       return this.http.get<MarketDetailsDto>(`/api/v1/medias/series/${programId}`);
//   }

//   getMediaDetailKeyframe(mediaId: number, programId: number) {
//       return this.http.get<MarketDetailsDto>(`/api/v1/media/get_program_keyframe?series_id=${mediaId}&program_id=${programId}`);
//   }

//   getMediaDetailHead(mediaId: number, programId: number) {
//       return this.http.get<MarketDetailsDto>(`/api/v1/media/get_program_head?series_id=${mediaId}&program_id=${programId}`);
//   }

//   getMediaDetailSubsection(mediaId: number, programId: number) {
//       return this.http.get<MarketDetailsDto>(`/api/v1/media/get_program_thumb?series_id=${mediaId}&program_id=${programId}`);
//   }

//   getMediaDetailSubtitle(mediaId: number, programId: number) {
//       return this.http.get<MarketDetailsDto>(`/api/v1/media/get_program_subtitle?series_id=${mediaId}&program_id=${programId}`);
//   }

//   getMediaDetailInfo(mediaId: number, programId: number) {
//       return this.http.get<MarketDetailsDto>(`/api/v1/media/get_series_info?series_id=${mediaId}&program_id=${programId}`);
//   }

//   getTwoDimensionalCode(programId: number) {
//     return this.http.get<string>(`api/v1/series/${programId}/share_code`);
//   }

//   getCollect(id: number) {
//     return this.http.get<string>(`api/v1/media/fav_series?sid=${id}`);
//   }

//   like(id: number) {
//     return this.http.get<string>(`api/v1/media/digg_series/${id}`);
//   }
publicityDetail(id: number) {
  return this.http.get<any>(`/api/v1/pub/publicity/${id}`, { params: { _allow_anonymous: '' } });
}

getSeriesDetailsInfo(id: number) {
  return this.http.get<any>(`/api/v1/pub/program/${id}`, { params: { _allow_anonymous: '' } });
}

getPublicitiesTypeList(pagination: PaginationDto, id: number, type: string) {
  return this.http.get<any>(`/api/v1/pub/publicity/${id}/${type}?page=${pagination.page}&page_size=${pagination.page_size}`, { params: { _allow_anonymous: '' } });
}

getTwoDimensionalCode(id: number) {
  return this.http.get<any>(`/api/v1/wechat/share_code/${id}`, { params: { _allow_anonymous: '' } });
}

shareEmail(email: string, url: string, publicity_name: string, sid: number) {
  // tslint:disable-next-line:max-line-length
  return this.http.get<any>(`/api/v1/email/share`, { params: { email, url, publicity_name, sid: sid as any, _allow_anonymous: ''} });
}

}
