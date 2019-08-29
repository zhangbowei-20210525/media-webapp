import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SeriesService } from '../../../series/series.service';
import { PaginationDto } from '@shared';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ACLAbility } from '@core/acl';
import { PersonalCenterService } from '../../personal-center.service';

@Component({
  selector: 'app-smples-details',
  templateUrl: './smples-details.component.html',
  styleUrls: ['./smples-details.component.less']
})
export class SmplesDetailsComponent implements OnInit {
  @ViewChild('publicityOk') publicityOk: any;
  readonly fileFilters = ['mp4', 'wmv', 'rmvb', 'mkv', 'mov', 'avi', 'mpg'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  pagination = { page: 1, page_size: 12 } as PaginationDto;
  isLoading: boolean;
  list = [];
  isMyDeatilsLoaded: boolean;
  id: any;
  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: SeriesService,
    private pcs: PersonalCenterService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      console.log(this.id);
    });
    this.fetchPublicities();
  }
  fetchPublicities() {
    this.isLoading = true;
    this.pcs.getReviewSample(this.id, this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isMyDeatilsLoaded = true;
      }))
      .subscribe(result => {
        this.list = result.list;
        this.pagination = result.pagination;
        console.log(this.list);
      });
  }
  // fetchPublicities() {
  //   this.isLoading = true;
  //   this.service.getIntentionTypeList(this.pagination)
  //     .pipe(finalize(() => {
  //       this.isLoading = false;
  //       this.isMyDeatilsLoaded = true;
  //     }))
  //     .subscribe(result => {
  //       this.list = result.list;
  //       this.pagination = result.pagination;
  //       console.log(this.list);
  //     });
  // }
  modeChange() {
    this.fetchPublicities();
  }

  getPageChange(page) {
    console.log(page, 'page');
    // you should print page
    console.log(page);
    this.pagination.page = page;
    console.log(this.pagination);
    this.fetchPublicities();
  }
  publicityPlay(id: number, sid: number, vid: number) {
    // console.log(id);
    this.router.navigate([`/manage/image/image-details/${id}`, { sid: sid , vid: vid}]);
  }
  returnBack() {
    this.router.navigate([`/manage/account-center/my-callup/my-samples`]);
  }
}

