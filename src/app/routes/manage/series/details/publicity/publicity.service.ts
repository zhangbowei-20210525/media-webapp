import { Injectable } from '@angular/core';
import { PaginationDto, PaginationResponseDto } from '@shared';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicityService {

  readonly videoFilters = ['mp4', 'wmv',  'rmvb', 'mkv', 'mov', 'avi', 'mpg'];
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
        return 'https://cs.bctop.net:7000/upload/video';
      case 'poster':
      case 'still':
        return 'https://cs.bctop.net:7000/upload/image';
      case 'pdf':
        return 'https://cs.bctop.net:7000/upload/document';
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

  bindingMateriel(id: number, extension: string, filename: string, name: string, size: number, material_type: string, company_ids: any) {
    return this.http.post<any>(`/api/v1/publicity/${id}`, { extension, filename, name, size, material_type, company_ids: company_ids });
  }

  request() {
    return this.http.get('http://127.0.0.1:8756/status');
  }

  requestGithub() {
    return this.http.get('https://api.github.com', { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } });
  }
}
