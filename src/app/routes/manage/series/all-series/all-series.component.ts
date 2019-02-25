import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from '../series.service';
import { PaginationDto } from '@shared';
import { finalize } from 'rxjs/operators';
import { AddSeriesInfoComponent } from '../components/add-series-info/add-series-info.component';
import { SeriesDto } from './dtos';

@Component({
  selector: 'app-all-series',
  templateUrl: './all-series.component.html',
  styleUrls: ['./all-series.component.less']
})
export class AllSeriesComponent implements OnInit {

  dataset: SeriesDto[] = [];
  isLoading: boolean;
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  allChecked: boolean;
  indeterminate: boolean;
  disabledButton: boolean;

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
    private service: SeriesService,
  ) { }

  ngOnInit() {
    this.fetchSeries();
  }

  fetchSeries() {
    this.isLoading = true;
    this.service.getSeries(this.pagination).pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.dataset = res.list;
      this.pagination = res.pagination;
      this.refreshStatus();
    });
  }

  refreshDataSet() {
    this.fetchSeries();
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
    this.refreshDataSet();
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

  addSeriesAgreed = (component: AddSeriesInfoComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
        this.service.getSeries(this.pagination).subscribe(s => {
          this.dataset = s.list;
          this.pagination = s.pagination;
        });
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
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
    this.service.deleteSeries(id).subscribe(res => {
      this.service.getSeries(this.pagination).subscribe(s => {
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
