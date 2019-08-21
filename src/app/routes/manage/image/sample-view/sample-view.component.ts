import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SeriesService } from '../../series/series.service';
import { PaginationDto } from '@shared';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ACLAbility } from '@core/acl';
import { fadeIn } from '@shared/animations';


@Component({
  selector: 'app-smple-view',
  templateUrl: './sample-view.component.html',
  styleUrls: ['./sample-view.component.less'],
  animations: [fadeIn],
})
export class SampleViewComponent implements OnInit {
  @ViewChild('publicityOk') publicityOk: any;
  readonly fileFilters = ['mp4', 'wmv', 'rmvb', 'mkv', 'mov', 'avi', 'mpg'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  pagination = { page: 1, page_size: 12 } as PaginationDto;
  isLoading: boolean;
  list = [];
  id: any;
  intention: number;
  isMyTapesLoaded = false;
  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: SeriesService,

  ) { }

  ngOnInit() {
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   this.searchText = params.get('search');
    //   this.fetchPublicities();
    // });
    this.fetchPublicities();
  }
  fetchPublicities() {
    this.isLoading = false;
    this.isMyTapesLoaded = false;
    const companyId = '';
    const receiverId = '';
    this.service.getIntentionTypeList(this.pagination, companyId, receiverId)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isMyTapesLoaded = true;

      }))
      .subscribe(result => {
        this.list = result.list;
        this.pagination = result.pagination;
        this.isMyTapesLoaded = true;

      });
    // console.log(this.intention);
    // console.log(this.list);
  }

  modeChange() {
    this.fetchPublicities();
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.fetchPublicities();
  }

  publicityPlay(id: number, sid: number, vid: number) {
    // console.log(id);
    // this.router.navigate([`/manage/image/image-details/${id}`, { sid: sid }]);
    this.router.navigate([`/manage/image/image-details/${id}`, { sid: sid, vid: vid }]);
  }

}

