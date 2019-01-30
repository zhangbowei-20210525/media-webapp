import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toFormData } from 'src/app/helpers/request.helper';
import { AuthService } from '..';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(
    private httpWithoutAuth: HttpClient,
    private auth: AuthService
  ) { }

  private get http() {
    return this.auth.checkSimple ? this.httpWithoutAuth : this.httpWithoutAuth;
  }

  private collectOperation(sampleId: number, operationType: string, operationLabel: string, operationContent: string) {
    return this.http.post('/api/v1/operation/collect_record', toFormData({
      sid: sampleId,
      o_type: operationType,
      o_label: operationLabel,
      o_content: operationContent
    }));
  }



  public collectClickJumpOf(sampleId: number, clickOperatio: string, timePoint: number) {
    return this.collectOperation(sampleId, 'click_jump', clickOperatio, timePoint.toString());
  }



  public collectLookOverOf(sampleId: number, tab: string) {
    return this.collectOperation(sampleId, 'look', tab, '');
  }

  public collectLookOverSubtitles(sampleId: number) {
    return this.collectLookOverOf(sampleId, 'subtitle');
  }

  public collectLookOverFaces(sampleId: number) {
    return this.collectLookOverOf(sampleId, 'head');
  }

  public collectLookOverKeyframes(sampleId: number) {
    return this.collectLookOverOf(sampleId, 'key_frame');
  }

  public collectLookOverInfo(sampleId: number) {
    return this.collectLookOverOf(sampleId, 'info');
  }

  public collectLookOverSegments(sampleId: number) {
    return this.collectLookOverOf(sampleId, 'segment');
  }



  public collectBrowseSample(sampleId: number, isPageJump: boolean, serieId: number) {
    return this.collectOperation(sampleId, isPageJump ? 'click_browse' : 'browse', 'video', serieId.toString());
  }



  // public collectDropProgressBar(sampleId: number, timePoint: number) {
  //   return this.collectOperation(sampleId, 'drop', 'progress_bar', timePoint.toString());
  // }



  public collectLeavePage(sampleId: number) {
    return this.collectOperation(sampleId, 'leave', 'video', '');
  }



  public getUserRecords(sampleId: number) {
    return this.http.get<{count: number, record_list: any[]}>(`/api/v1/operation/get_record_of_user?sid=${sampleId}`);
  }

  public getRecordsOfInfo(operationId: number) {
    return this.http.get<{count: number, record_info_list: any[]}>(`/api/v1/operation/get_record_of_info?oid=${operationId}`);
  }
}
