import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { AddSeriesInfoComponent } from './components/add-series-info/add-series-info.component';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from './series.service';
import { AddOwnCopyrightComponent } from './components/add-own-copyright/add-own-copyright.component';
import { PaginationDto, MessageService } from '@shared';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.less']
})
export class SeriesComponent implements OnInit {

  allChecked = false;
  indeterminate = false;
  displayData = [];
  seriesList = [];
  type: string;
  seriesPagination: PaginationDto;

  constructor(
    private router: Router,
    private modalService: NzModalService,
    private message: MessageService,
    private translate: TranslateService,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.type = 'series';
    this.seriesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.seriesService.getSeries(this.seriesPagination).subscribe(res => {
      this.seriesList = res.list;
      this.seriesPagination = res.pagination;
    });
  }

  seriesRefresh() {
    this.type = 'series';
    this.seriesService.getSeries(this.seriesPagination).subscribe(res => {
      this.seriesList = res.data.list;
      this.seriesPagination = res.data.pagination;
    });
  }

  publicitiesRefresh() {
    this.type = 'publicity';
    this.seriesService.eventEmit.emit('publicitiesRefresh');
  }

  copyrightRefresh() {
    this.type = 'copyright';
    this.seriesService.eventEmit.emit('copyrightRefresh');
  }

  tapesRefresh() {
    this.type = 'tape';
    this.seriesService.eventEmit.emit('tapesRefresh');
  }

  // tslint:disable-next-line:max-line-length
  currentPageDataChange($event: Array<{ name: string; program_type: string; theme: string; episode: number; language: string; release_date: string; checked: boolean }>): void {
    this.displayData = $event;
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  refreshStatus(page: number): void {
    this.seriesPagination.page = page;
    this.seriesService.getSeries(this.seriesPagination).subscribe(res => {
      this.seriesList = res.data.list;
      this.seriesPagination = res.data.pagination;
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

  publicity(id: number) {
    this.router.navigate([`/manage/series/series-details/${id}/series-details-publicity`]);
  }

  tape(id: number) {
    console.log(id);
    this.router.navigate([`/manage/series/series-details/${id}/series-details-tape`]);
  }

  copyright(id: number) {
    this.router.navigate([`/manage/series/series-details/series-details-copyright`]);
  }

  addSeries() {
    this.modalService.create({
      nzTitle: `新增节目`,
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
        this.seriesService.getSeries(this.seriesPagination).subscribe(s => {
          this.seriesList = s.list;
          this.seriesPagination = s.pagination;
        });
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  deleteSeries(id: number) {
    this.modalService.confirm({
      nzTitle: '是否删除本条节目信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteSeriesAgreed(id)
    });
  }

  deleteSeriesAgreed = (id: number) => new Promise((resolve) => {
    this.seriesService.deleteSeries(id).subscribe(res => {
      this.seriesService.getSeries(this.seriesPagination).subscribe(s => {
        this.seriesList = s.data.list;
        this.seriesPagination = s.data.pagination;
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

  addOwnRight() {
    this.modalService.create({
      nzTitle: `新增自有版权`,
      nzContent: AddOwnCopyrightComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addCopyrightAgreed
    });
  }

  addCopyrightAgreed = (component: AddOwnCopyrightComponent) => new Promise((resolve) => {
    // if (component.checkContractForm()) {
    //   component.submitContractForm().subscribe(res => {
    //     this.messageService.success('添加版权成功');
    //     this.refreshCurrent();
    //     resolve();
    //   }, err => {
    //     this.messageService.error('添加版权失败：' + (typeof err.message === 'string' ? err.message : '服务器错误'));
    //     resolve(false);
    //   });
    // } else {
    //   resolve(false);
    // }
  })

}
