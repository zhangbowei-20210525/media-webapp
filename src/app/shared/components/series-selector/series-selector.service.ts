import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeriesBriefDto, SearchMetaDataDto } from './dtos';

declare interface BriefSeriesResultDto {
  list: SeriesBriefDto[];
  meta: { program_type_choices: string[], release_year_choices: SearchMetaDataDto[] };
}

@Injectable({
  providedIn: 'root'
})
export class SeriesSelectorService {

  constructor(
    private http: HttpClient
  ) { }

  getSeries(employee: number) {
    return this.http.get<BriefSeriesResultDto>(`/api/v1/employees/${employee}/programs`);
  }

  updateSeriesPermission(employee: number, status: boolean, program_ids: number[]) {
    return this.http.post<BriefSeriesResultDto>(`/api/v1/employees/${employee}/programs`, { status, program_ids });
  }

}
