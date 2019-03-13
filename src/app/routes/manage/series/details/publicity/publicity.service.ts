import { Injectable } from '@angular/core';
import { PaginationDto, PaginationResponseDto } from '@shared';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicityService {

  readonly videoFilters = ['.mp4', '.avi', '.rmvb', '.wmv', '.mkv', '.mov', '.flv', '.mpeg', '.vob', '.webm', '.mpg', '.mxf'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly docmentFilters = ['.pdf'];

  constructor(private http: HttpClient) { }

  getFilters(type: string) {
    switch (type) {
      case 'sample':
      case 'feature':
      case 'trailer':
        return this.videoFilters;
      case 'poster':
      case 'still':
        return this.imageFilters;
      case 'pdf':
        return this.docmentFilters;
      default:
        return [];
    }
  }

  getUploadUrl(type: string) {
    switch (type) {
      case 'sample':
      case 'feature':
      case 'trailer':
        return '/api/v1/upload/video';
      case 'poster':
      case 'still':
        return '/api/v1/upload/image';
      case 'pdf':
        return '/api/v1/upload/docment';
    }
  }

  getPublicities(seriesId: number) {
    return this.http.get<PaginationResponseDto<any>>('/api/v1/publicity', { params: { program_id: seriesId as any } });
  }

  getPublicity(id: number) {
    return this.http.get<any>(`/api/v1/publicity/${id}`);
  }

  getMateriels(id: number, type: string, pagination: PaginationDto) {
    return this.http.get<PaginationResponseDto<any>>(`/api/v1/publicity/${id}/${type}`,
    { params: { page: pagination.page as any, page_size: pagination.page_size as any } });
  }

  bindingMateriel(publicity_id: number, material_id: number, material_type: string) {
    return this.http.post<any>(`/api/v1/publicity/${publicity_id}`, { material_id, material_type });
  }
}
