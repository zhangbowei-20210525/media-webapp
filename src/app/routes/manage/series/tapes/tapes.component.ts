import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationDto } from '@shared';
import { SeriesService } from '../series.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddTapeComponent } from '../components/add-tape/add-tape.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tapes',
  templateUrl: './tapes.component.html',
  styleUrls: ['./tapes.component.less']
})
export class TapesComponent implements OnInit {

  tapesPagination: PaginationDto;
  tapesList = [];

  constructor(
    private router: Router,
    private seriesService: SeriesService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.tapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.seriesService.eventEmit.subscribe((value: any) => {
      if (value === 'tapesRefresh') {
        this.seriesService.getAllTapes(this.tapesPagination).subscribe(res => {
          this.tapesList = res.list;
          this.tapesPagination = res.pagination;
        });
      }
    });
    this.seriesService.getAllTapes(this.tapesPagination).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  tapesPageChange(page: number) {
    this.tapesPagination.page = page;
    this.seriesService.getAllTapes(this.tapesPagination).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  tapeDetails(program_id: number, id: number, source_type: string) {
    if (source_type === 'online') {
      this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: id, source_type: 'online' }]);
    }
    if (source_type === 'entity') {
      this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: id, source_type: 'entity'}]);
    }
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
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })
}
