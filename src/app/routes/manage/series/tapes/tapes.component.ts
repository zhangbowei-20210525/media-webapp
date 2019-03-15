import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationDto, AccountService } from '@shared';
import { SeriesService } from '../series.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddTapeComponent } from '../components/add-tape/add-tape.component';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tapes',
  templateUrl: './tapes.component.html',
  styleUrls: ['./tapes.component.less'],
})
export class TapesComponent implements OnInit {

  isLoaded = false;
  isLoading = false;
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  dataset = [];

  constructor(
    private router: Router,
    private service: SeriesService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.fetchPublicities();
  }

  fetchPublicities() {
    this.isLoading = true;
    this.service.getAllTapes(this.pagination)
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

  tapeDetails(program_id: number, tapeId: number, source_type: string) {
    this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: tapeId, source_type: source_type}]);
  }

  addTape() {
    this.modal.create({
      nzTitle: `新增母带`,
      nzContent: AddTapeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addTapeAgreed
    });
  }

  addTapeAgreed = (component: AddTapeComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
        this.fetchPublicities();
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  deleteTape(id: number) {
    this.modal.confirm({
      nzTitle: '是否删除本条节目信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteTapeAgreed(id)
    });
  }

  deleteTapeAgreed = (id: number) => new Promise((resolve) => {
    this.service.deleteTape(id).subscribe(res => {
      this.fetchPublicities();
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
