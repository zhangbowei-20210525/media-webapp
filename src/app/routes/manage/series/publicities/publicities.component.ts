import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeriesService } from '../series.service';
import { PaginationDto } from '@shared';
import { fadeIn } from '@shared/animations';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-publicities',
  templateUrl: './publicities.component.html',
  styleUrls: ['./publicities.component.less'],
  animations: [fadeIn]
})
export class PublicitiesComponent implements OnInit {

  allChecked = false;
  indeterminate = false;
  disabledButton = false;
  isLoaded = false;
  isLoading = false;
  dataset = [];
  pagination = { page: 1, page_size: 10 } as PaginationDto;

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

  pageChnage(page: number) {
    this.pagination.page = page;
    this.fetchPublicities();
  }

  refreshStatus(): void {
    const allChecked = this.dataset.every(value => value.checked === true);
    const allUnChecked = this.dataset.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataset.some(value => value.checked);
  }

  checkedChange() {
    this.refreshStatus();
  }

  checkAll(value: boolean): void {
    this.dataset.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  publicityDetails(id: number) {
    this.router.navigate([`/manage/series/d/${id}/publicityd`]);
  }


}
