import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeriesService } from '../../series.service';
import { PaginationDto } from '@shared';

@Component({
  selector: 'app-publicities',
  templateUrl: './publicities.component.html',
  styleUrls: ['./publicities.component.less']
})
export class PublicitiesComponent implements OnInit {

  constructor(
    private router: Router,
    private seriesService: SeriesService,
  ) { }

  allChecked = false;
  indeterminate = false;
  displayData = [];
  publicitiesPagination: PaginationDto;
  publicitiesList = [];

  ngOnInit() {
    this.publicitiesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.seriesService.eventEmit.subscribe((value: any) => {
      if (value === 'publicitiesRefresh') {
        this.seriesService.getPublicities(this.publicitiesPagination).subscribe(res => {
          this.publicitiesList = res.data.list;
          this.publicitiesPagination = res.data.pagination;
        });
      }
    });
    this.seriesService.getPublicities(this.publicitiesPagination).subscribe(res => {
      this.publicitiesList = res.data.list;
      this.publicitiesPagination = res.data.pagination;
    });
  }
  currentPageDataChange($event: Array<{
    name: string; sample: number; feature: number; trailer: number;
    poster: number; still: number; pdf: number; checked: boolean
  }>): void {
    this.displayData = $event;
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  refreshStatus(page: number): void {
    this.publicitiesPagination.page = page;
    this.seriesService.getPublicities(this.publicitiesPagination).subscribe(res => {
      this.publicitiesList = res.data.list;
      this.publicitiesPagination = res.data.pagination;
    });
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkedChange() {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      data.checked = value;
    });
    const allChecked = this.displayData.every(x => x.checked === true);
    const allUnChecked = this.displayData.every(x => !x.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  publicityDetails(id: number) {
    this.router.navigate([`/manage/series/series-details/${id}/series-details-publicity`]);
  }


}
