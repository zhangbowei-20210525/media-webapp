import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveBase, PaginationResponseDto } from '@shared';
import { ReactiveSilder } from '@shared/reactive-form/reactive-slider';
import { ReactiveSelect } from '@shared/reactive-form/reactive-select';

@Injectable({
  providedIn: 'root'
})
export class ChoreographyService {

  public eventEmit: any;

  constructor(
    protected http: HttpClient,
  ) {
    this.eventEmit = new EventEmitter();
  }

  // getBroadcastEpisodes(count: number): ReactiveBase<any>[][] {
  //   const broadcastEpisodes: ReactiveBase<any>[][] = [];
  //   for (let index = 0; index < count; index++) {
  //     const episode: ReactiveBase<any>[] = [
  //       new ReactiveSilder({
  //         key: 'broadcastDate' + index,
  //         label: '播出日期',
  //         required: true,
  //         max: 7,
  //         min: 1,
  //         range: false,
  //         included: true,
  //       }),
  //       new ReactiveSelect({
  //         key: 'episodes' + index,
  //         label: '集数',
  //         required: true,
  //       }),
  //     ];
  //     episode.sort((a, b) => a.order - b.order);
  //     broadcastEpisodes.push(episode);
  //   }
  //   return broadcastEpisodes;
  // }

  addTheatre(newTheatre: {
    channel_name: string, name: string, air_date: string, broadcast_time: string, weekday_schedules: any[]}) {
    return this.http.post<any>(`/api/v1/editing/columns`, newTheatre);
  }

  getTheatreList() {
    return this.http.get<any>(`/api/v1/editing/channels`);
  }

  deleteTheatre(id: number) {
    return this.http.delete<any>(`/api/v1/editing/columns/${id}`);
  }

  deleteChannel(id: number) {
    return this.http.delete<any>(`/api/v1/editing/channels/${id}`);
  }

  getSeriesList() {
    return this.http.get<PaginationResponseDto<any>>(`/api/v1/programs/info/editing`);
  }

  addTheatreSeries(method: string, column_id: number, program_id: number) {
    return this.http.post<any>(`/api/v1/editing/schedules/programs`, { method: method, column_id: column_id, program_id: program_id });
  }

  addInsertBroadcastInfo( method: string,
    column_id: number,
    program_id: number,
    broadcast_date: string,
    start_episode: number,
    end_episode: number,
    program_schedule_id: number
  ) {
    return this.http.post<any>(`/api/v1/editing/schedules/programs`,
    { method: method,
      column_id: column_id,
      program_id: program_id,
      broadcast_date: broadcast_date,
      start_episode: start_episode,
      end_episode: end_episode,
      program_schedule_id: program_schedule_id });
  }

  addBroadcastingInfo(
    method: string,
    column_id: number,
    program_id: number,
    broadcast_date: string,
    start_episode: number,
    end_episode: number,
  ) {
    return this.http.post<any>(`/api/v1/editing/schedules/programs`, {  method: method,
      column_id: column_id,
      program_id: program_id,
      broadcast_date: broadcast_date,
      start_episode: start_episode,
      end_episode: end_episode, });
  }

  deleteTheatreSeries(id: number) {
    return this.http.delete<any>(`/api/v1/editing/schedules/programs/${id}`);
  }

  getChannelInfo() {
    return this.http.get<any>(`/api/v1/editing/calendar/month`);
  }

  getSpecifiedChannelInfo(id: number, year: number, month: number) {
    return this.http.get<any>(`/api/v1/editing/calendar/${id}/month?year=${year}&month=${month}`);
  }

}
