import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SeriesService } from '../series/series.service';
import { PaginationDto } from '@shared';
import { NzModalRef, NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { finalize, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { ACLAbility } from '@core/acl';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent implements OnInit {
  @ViewChild('publicityOk') publicityOk: any;
  readonly fileFilters = ['mp4', 'wmv', 'rmvb', 'mkv', 'mov', 'avi', 'mpg'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  allChecked = false;
  indeterminate = false;
  disabledButton: boolean;
  pagination = { page: 1, page_size: 12 } as PaginationDto;
  addPublicityModal: NzModalRef;
  publicityId: number;
  isLoading: boolean;
  isLoaded: boolean;  dataset = [];
  list = [];
  searchText: string;
  company_ids = [];

  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: SeriesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchText = params.get('search');
      this.fetchPublicities();
    });
  }

  fetchPublicities() {
    this.isLoading = true;
    this.service.getIntentionTypeList(this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
      }))
      .subscribe(result => {
        this.list = result.list;
        this.pagination = result.pagination;
      });
  }
  modeChange() {
    this.fetchPublicities();
  }

  pageChange(page: number) {
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

  publicityPlay(id: number, sid: number) {
    this.router.navigate([`/manage/image/image-details/${id}`, { sid: sid }]);
  }
}
