import { PaginationDto } from '@shared';
import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from '../personal-center.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-browse-record',
  templateUrl: './browse-record.component.html',
  styleUrls: ['./browse-record.component.less']
})
export class BrowseRecordComponent implements OnInit {

  isLoaded: boolean;
  isLoading: boolean;
  pagination: PaginationDto;
  list = [];

  constructor(
    private pcs: PersonalCenterService,
  ) { }

  ngOnInit() {
    this.isLoaded = false;
    this.isLoading = true;
    this.pagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.pcs.getBrowseRecord(this.pagination).pipe(finalize(() => {
      this.isLoading = false;
      this.isLoaded = true;
    })).subscribe(res => {
      console.log(res);
      this.list = res.list;
      this.pagination = res.pagination;
    });
  }

  pageChange(page: number) {
    this.isLoading = true;
    this.pagination.page = page;
    this.pcs.getBrowseRecord(this.pagination).pipe(finalize(() => {
      this.isLoading = false;
      this.isLoaded = true;
    })).subscribe(res => {
      this.list = res.list;
      this.pagination = res.pagination;
    });
  }

}
