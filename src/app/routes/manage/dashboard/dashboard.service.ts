import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardDto } from './dtos';
import { ResponseDto } from '@shared';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    protected http: HttpClient,
  ) { }

  getExpireInfo() {
    return this.http.get<any>('/api/v1/analysis/period');
  }

  // getSeriesPieChart(startYear: string, endYear: string) {
  //   return this.http.get<any>(`/api/v1/analysis/program/pie?start_year=${startYear}&end_year=${endYear}`);
  // }

  // getSeriesLineChart(title: string, startYear: string, endYear: string) {
  //   return this.http.get<any>(`/api/v1/analysis/program/line?title=${title}&start_year=${startYear}&end_year=${endYear}`);
  // }

  getDataStatistics(start_year: number, start_month: number, end_year: number, end_month: number, is_episode: string, title: string) {
    console.log(start_year);
    // tslint:disable-next-line:max-line-length
    return this.http.get<any>(`/api/v1/analysis/program/pie?start_year=${start_year}&start_month=${start_month}&end_year=${end_year}&end_month=${end_month}&is_episode=${is_episode}&title=${title}`);
  }

  getPublicityStatistics(timeStatisticsType: string) {
    return this.http.get<any>(`/api/v1/analysis/publicity?title=${timeStatisticsType}`);
  }

  getPublishStatistics(publishStatisticsType: string) {
    return this.http.get<any>(`/api/v1/analysis/publish_right?title=${publishStatisticsType}`);
  }

  getTapeStatistics(tapeStatisticsType: string) {
    return this.http.get<any>(`/api/v1/analysis/source?title=${tapeStatisticsType}`);
  }

  getActiveProject(type: string) {
    return this.http.get<any>(`/api/v1/analysis/activation?title=${type}`);
  }

  getAllStatistics(year: any, areas: any, id: any) {
    return this.http.get<any>(`/api/v1/analysis/rights/contracts/publish/quarter?year=${year}&areas=${areas}&program_id=${id}`);
  }

  getAnnualStatistics(year: any, areas: any, id: any) {
    return this.http.get<any>(`/api/v1/analysis/rights/contracts/publish/year?&year=${year}&areas=${areas}&program_id=${id}`);
  }

  searchSeries(name: string, program_ids: any) {
    return this.http.get<any>(`/api/v1/programs/brief?q=${name}&program_ids=${program_ids}`);
  }

  getPurCustomer(start_date: any, end_date: any) {
    return this.http.get<any>(`/api/v1/analysis/rights/contracts/purchase/custom?start_date=${start_date}&end_date=${end_date}`);
  }

  getPubCustomer(start_date: any, end_date: any) {
    return this.http.get<any>(`/api/v1/analysis/rights/contracts/publish/custom?start_date=${start_date}&end_date=${end_date}`);
  }

  getReviewList(year: number, month: number) {
    return this.http.get<any>(`/api/v1/reviews/report?year=${year}&month=${month}`);
  }
}
