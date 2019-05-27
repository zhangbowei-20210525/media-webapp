import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { PaginationResponseDto, PaginationDto } from '@shared';
import { BehaviorSubject, interval, Subject, Observable, Subscription } from 'rxjs';
// import { mergeMap } from 'rxjs/operators';
interface NotifiesDto {
  base: {
    source: { has_active_source_task: boolean, active_source_task_num: number },
    notify: { has_unread: boolean, unread_num: number, unread_system_num: number, unread_source_num: number, unread_outside_num: number };
  };
  active_source_tasks: any[];
  source_id: any[];
  source_files: any[];
}

@Injectable()
export class NotifiesPolling {
  private readonly timeSpan = 15 * 1e3;

  private readonly notifies$: Subject<never> = new Subject();
  private readonly result$: Subject<NotifiesDto> = new Subject();

  private subscriptions: Subscription[] = [];

  private isActiveSourceTasks = false;

  private sourceId = null;

  constructor(private http: HttpClient) {
    // this.notifies$ = new Subject().pipe(mergeMap(() => this.getNotifies()));
  }

  // private notifiesMerge() {
  //   return this.notifies$.pipe(mergeMap(() => this.getNotifies()));
  // }

  startNotifiesPolling() {
    this.subscriptions = [
      this.notifies$.subscribe(() => this.getNotifies()
        .subscribe(result => this.result$.next(result))),
      interval(this.timeSpan).subscribe(() => this.nextNotifies())
    ];

    // this.intervalSubscription = interval(5000)
    // .pipe(mergeMap(() => this.notifiesMerge()))
    // .subscribe(this.result$.next);
  }

  stopNotifiesPolling() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  private getParams() {
    const map = {} as any;
    if (this.isActiveSourceTasks) {
      map.active_source_tasks = 1;
    }
    if (this.sourceId) {
      map.source_id = this.sourceId;
    }
    return map;
  }

  private getNotifies() {
    return this.http.get<NotifiesDto>('/api/v1/polling', {
      params: this.getParams()
    });
  }

  nextNotifies(): void {
    this.notifies$.next();
  }

  notifies() {
    return this.result$.asObservable();
  }

  setIsActiveSourceTasks(state: boolean) {
    this.isActiveSourceTasks = state;
  }

  setIsActiveSourceFileStatus(state: boolean, id?: number) {
    if (state) {
      this.sourceId = id;
    } else {
      this.sourceId = null;
    }
  }
}
