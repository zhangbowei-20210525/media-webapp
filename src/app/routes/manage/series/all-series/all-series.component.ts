import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from '../series.service';
import { PaginationDto } from '@shared';
import { finalize, tap, switchMap } from 'rxjs/operators';
import { AddSeriesInfoComponent } from '../components/add-series-info/add-series-info.component';
import { SeriesDto } from './dtos';
import { fadeIn } from '@shared/animations';
import { AddPublicityComponent } from '../components/add-publicity/add-publicity.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AddTapeComponent } from '../components/add-tape/add-tape.component';
import * as _ from 'lodash';
import { indexMap } from '@shared/rxjs/operators';
import { ACLAbility } from '@core/acl';

@Component({
  selector: 'app-all-series',
  templateUrl: './all-series.component.html',
  styleUrls: ['./all-series.component.less'],
  animations: [fadeIn]
})
export class AllSeriesComponent implements OnInit {

  dataset: SeriesDto[] = [];
  isLoaded = false;
  isLoading = false;
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  allChecked: boolean;
  indeterminate: boolean;
  disabledButton: boolean;
  isVisiblePublicity = false;
  addPublicityModal: NzModalRef;
  id: number;
  publicityId: number;
  searchText: string;

  constructor(
    public ability: ACLAbility,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
    private seriesService: SeriesService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchText = params.get('search');
      this.fetchSeries();
    });
  }

  fetchSeries() {
    this.isLoading = true;
    (_.isString(this.searchText) ?
      this.seriesService.searchSeries(this.searchText, this.pagination) :
      this.seriesService.getSeries(this.pagination))
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
      }), tap(data => {
        for (const iterator of data.list) {
          if (iterator.release_date) {
            iterator.release_date = iterator.release_date.substring(0, 10);
          }
        }
      }), indexMap())
      .subscribe(result => {
        this.dataset = result.list;
        this.pagination = result.pagination;
        this.refreshStatus();
      });
  }

  refreshDataSet() {
    this.fetchSeries();
  }

  seriesDetails(id: number) {
    this.router.navigate([`/manage/series/d/${id}`, { sif: 'show' }, 'right']);
  }

  refreshStatus(): void {
    const allChecked = this.dataset.length > 0 ? this.dataset.every(value => value.checked === true) : false;
    const allUnChecked = this.dataset.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataset.some(value => value.checked);
  }

  checkAll(value: boolean): void {
    this.dataset.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.refreshDataSet();
  }

  checkedChange() {
    this.refreshStatus();
  }

  addSeries() {
    this.modal.create({
      nzTitle: '新增节目',
      nzContent: AddSeriesInfoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addSeriesAgreed
    });
  }

  addSeriesAgreed = (component: AddSeriesInfoComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit().subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
        this.refreshDataSet();
        resolve();
      }, error => {
        reject(false);
      });
    } else {
      reject(false);
    }
  })

  deleteSeries(id: number) {
    this.modal.confirm({
      nzTitle: '是否删除本条节目信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteSeriesAgreed(id)
    });
  }

  deleteSeriesAgreed = (id: number) => new Promise((resolve) => {
    this.seriesService.deleteSeries(id).subscribe(res => {
      this.seriesService.getSeries(this.pagination).pipe(tap(x => {
        x.list.forEach(f => {
          if (f.release_date) {
            f.release_date = f.release_date.substring(0, 10);
          }
        });
      })).subscribe(s => {
        this.dataset = s.list;
        this.pagination = s.pagination;
      });
      this.message.success(this.translate.instant('global.delete-success'));
      resolve();
    }, error => {
      if (error.message) {
        this.message.error(error.message);
      }
      resolve(false);
    });
  })
}
