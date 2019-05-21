import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { PaginationResponseDto, PaginationDto } from '@shared';
import { BehaviorSubject, interval, Subject, Observable, Subscription } from 'rxjs';
// import { mergeMap } from 'rxjs/operators';

interface NotifiesDto { base: any; active_source_tasks: any[]; }

@Injectable({
  providedIn: 'root',
})
export class HeaderService {

  private readonly notifies$: Subject<any> = new Subject();
  private readonly result$: Subject<any> = new Subject();

  private subscriptions: Subscription[] = [];

  private isActiveSourceTasks = false;

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
      interval(5000).subscribe(() => this.nextNotifies())
    ];

    // this.intervalSubscription = interval(5000)
    // .pipe(mergeMap(() => this.notifiesMerge()))
    // .subscribe(this.result$.next);
  }

  stopNotifiesPolling() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private getNotifies() {
    return this.http.get<NotifiesDto>('/api/v1/polling', {
      params: {
        active_source_tasks: (this.isActiveSourceTasks ? 1 : 0) as any,
      }
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
}