import { Injectable } from '@angular/core';
import { ReactiveBase, ReactiveTextbox } from '@shared';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilmReviewService {

  constructor(
    protected http: HttpClient,
  ) { }

  getFilmReviewList() {
    return this.http.get<any>(`/api/v1/reviews/configs`);
  }

  getFilmReviewDetails(id: number) {
    return this.http.get<any>(`/api/v1/reviews/configs/${id}`);
  }

  getFilmReviewTeam(id: any) {
    return this.http.get<any>(`/api/v1/reviews/configs/departments`, { params: { step_config_id: id } });
  }

  addFilmReviewTeam(name: string) {
    return this.http.post<any>(`/api/v1/companies/departments/reviews`, { name: name });
  }

  getFilmReviewPeople(lid: any, bid: any) {
    return this.http.get<any>(`/api/v1/reviews/configs/departments/employees`, { params: { step_config_id: lid, department_id: bid } });
  }

  addFilmReviewPeople(id: number, arr: any) {
    return this.http.post<any>(`/api/v1/companies/departments/reviews/${id}/employees`, { employees: arr });
  }

  saveFilmReviewTeamInfo(id: number, department_id: number, employee_ids: any[]) {
    return this.http.post<any>(`/api/v1/reviews/configs/${id}/employees`, { department_id, employee_ids });
  }

  getConclusionConfigInfo() {
    return this.http.get<any>(`/api/v1/reviews/conclusion_items`);
  }

  saveConclusionConfigInfo(id: number, conclusion_item_id: number) {
    return this.http.post<any>(`/api/v1/reviews/configs/${id}/conclusion_item`, { conclusion_item_id });
  }

  getScoreConfigInfo() {
    return this.http.get<any>(`/api/v1/reviews/scoring_items`);
  }

  saveScoreConfigInfo(id: number, scoring_items: any[]) {
    return this.http.post<any>(`/api/v1/reviews/configs/${id}/scoring_items`, { scoring_items: scoring_items });
  }

  saveScoreInfo(name: string) {
    return this.http.post<any>(`/api/v1/reviews/scoring_items`, { name });
  }

  saveIdeaInfo(id: number, comment_status: boolean) {
    return this.http.post<any>(`/api/v1/reviews/configs/${id}/comment_status`, { comment_status });
  }

  getPeopleInfoInput(count: number): ReactiveBase<any>[][] {
    const reviewPeopleInfos: ReactiveBase<any>[][] = [];
    for (let index = 0; index < count; index++) {
      const reviewPeopleInfo: ReactiveBase<any>[] = [
        new ReactiveTextbox({
          key: 'reviewPeople' + index,
          label: '审片人',
          type: 'text',
          required: true,
          order: 1,
          customerType: 'reviewPeople',
        }),
        new ReactiveTextbox({
          key: 'phone' + index,
          label: '手机号码',
          required: true,
          reg: /^[1][3,4,5,7,8][0-9]{9}$/,
          type: 'text',
          order: 2,
          customerType: 'phone'
        })
      ];
      reviewPeopleInfo.sort((a, b) => a.order - b.order);
      reviewPeopleInfos.push(reviewPeopleInfo);
    }
    return reviewPeopleInfos;
  }

  isHasFilmReview() {
    return this.http.get<any>(`/api/v1/reviews/configs/status`);
  }
}
