import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationDto } from '@shared';
import { SeriesService } from '../series.service';

@Component({
  selector: 'app-tapes',
  templateUrl: './tapes.component.html',
  styleUrls: ['./tapes.component.less']
})
export class TapesComponent implements OnInit {

  tapesPagination: PaginationDto;
  tapesList = [];

  constructor(
    private router: Router,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.tapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.seriesService.eventEmit.subscribe((value: any) => {
      if (value === 'tapesRefresh') {
        this.seriesService.getAllTapes(this.tapesPagination).subscribe(res => {
          this.tapesList = res.list;
          this.tapesPagination = res.pagination;
        });
      }
    });
    this.seriesService.getAllTapes(this.tapesPagination).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  tapesPageChange(page: number) {
    this.tapesPagination.page = page;
    this.seriesService.getAllTapes(this.tapesPagination).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  tapeDetails(program_id: number, id: number) {
    this.router.navigate([`/manage/series/d/${program_id}/tape`, {tapeId: id}]);
  }
}
