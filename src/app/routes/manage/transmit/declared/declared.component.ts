import { Component, OnInit } from '@angular/core';
import { PaginationDto } from '@shared';
import { finalize, switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SeriesService } from '../../series/series.service';
import { isMonday } from 'date-fns';
import { fadeIn } from '@shared/animations';

@Component({
  selector: 'app-declared',
  templateUrl: './declared.component.html',
  styleUrls: ['./declared.component.less'],
  animations: [fadeIn],
})
export class DeclaredComponent implements OnInit {
  isMyTapesLoaded = false;
  isMyTapesLoading = true;
  tapesPagination: PaginationDto;
  purchaseTapesPagination: PaginationDto;
  tabIndex: number;
  isPurchaseTapesLoaded: boolean;
  isPurchaseTapesLoading: boolean;
  tapesList = [];

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.tapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.purchaseTapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.tabIndex = +params.get('tabIndex');
        return  this.seriesService.getAllTapes(this.tapesPagination);
      })).pipe(finalize(() => {
      this.isMyTapesLoading = false;
      this.isMyTapesLoaded = true;
      console.log(this.isMyTapesLoaded);
    })).subscribe(res => {
      this.isMyTapesLoaded = true;
      this.isMyTapesLoading = false;
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
    this.purchaseTapes();
  }

    tapesPageChange(page: number) {
    this.isMyTapesLoading = true;
    this.tapesPagination.page = page;
    this.seriesService.getAllTapes(this.tapesPagination).pipe(finalize(() => {
      this.isMyTapesLoading = false;
    })).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  tapeDetails(program_id: number, id: number, source_type: string) {
    if (source_type === 'online') {
      this.router.navigate([`/manage/series/d/${program_id}/tape`, {tapeId: id, source_type: 'online'}]);
    }
    if (source_type === 'entity') {
      this.router.navigate([`/manage/series/d/${program_id}/tape`, {tapeId: id, source_type: 'entity'}]);
    }
  }

  myTapes() {
    this.isMyTapesLoading = true;
    this.seriesService.getAllTapes(this.tapesPagination).pipe(finalize(() => {
      this.isMyTapesLoading = false;
    })).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  purchaseTapes() {
    this.seriesService.purchaseTapes(this.purchaseTapesPagination).pipe(finalize(() => {
      this.isPurchaseTapesLoading = false;
      this.isPurchaseTapesLoaded = true;
    })).subscribe(res => {
      this.purchaseTapesPagination = res.pagination;
    });
  }

  purchaseTapesPageChange(page: number) {
    this.isPurchaseTapesLoading = true;
    this.purchaseTapesPagination.page = page;
    this.seriesService.purchaseTapes(this.purchaseTapesPagination).pipe(finalize(() => {
      this.isPurchaseTapesLoading = false;
    })).subscribe(res => {
      this.purchaseTapesPagination = res.pagination;
    });
  }
}
