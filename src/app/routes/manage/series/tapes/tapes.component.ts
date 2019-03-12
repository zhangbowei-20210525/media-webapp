import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationDto } from '@shared';
import { SeriesService } from '../series.service';
import { finalize } from 'rxjs/operators';
import { fadeIn } from '@shared/animations';

@Component({
  selector: 'app-tapes',
  templateUrl: './tapes.component.html',
  styleUrls: ['./tapes.component.less'],
  animations: [fadeIn]
})
export class TapesComponent implements OnInit {

  isLoaded = false;
  isLoading = false;
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  dataset = [];

  constructor(
    private router: Router,
    private service: SeriesService,
  ) { }

  ngOnInit() {
    this.fetchPublicities();
  }

  fetchPublicities() {
    this.isLoading = true;
    this.service.getPublicities(this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        if (!this.isLoaded) {
          this.isLoaded = true;
        }
      }))
      .subscribe(result => {
        this.dataset = result.list;
        this.pagination = result.pagination;
      });
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.fetchPublicities();
  }

  tapeDetails(program_id: number, tapeId: number, source_type: 'online' | 'entity') {
    this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId, source_type }]);
  }
}
