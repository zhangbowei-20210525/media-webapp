import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    protected http: HttpClient,
  ) { }

  getExpireInfo() {
    return this.http.get<any>('api/v1/analysis/period');
  }

  getSeriesStatistics(seriesStatisticsType: string) {
    return this.http.get<any>(`api/v1/analysis/program?title=${seriesStatisticsType}`);
  }

  getPublicityStatistics(timeStatisticsType: string) {
    return this.http.get<any>(`api/v1/analysis/publicity?title=${timeStatisticsType}`);
  }

  getPublishStatistics(publishStatisticsType: string) {
    return this.http.get<any>(`api/v1/analysis/publish_right?title=${publishStatisticsType}`);
  }

  getTapeStatistics(tapeStatisticsType: string) {
    return this.http.get<any>(`api/v1/analysis/source?title=${tapeStatisticsType}`);
  }

  getActiveProject(type: string) {
    return this.http.get<any>(`api/v1/analysis/activation?title=${type}`);
  }

  getAllStatistics(year: any, areas: any) {
    return this.http.get<any>(`api/v1/analysis/right/quarter?year=${year}&areas=${areas}`);
  }
}
