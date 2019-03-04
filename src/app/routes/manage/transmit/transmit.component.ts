import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../series/series.service';
import { PaginationDto } from '@shared';
import { finalize, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { TapeDownloadComponent } from './components/tape-download/tape-download.component';
import { TransmitService } from './transmit.service';

@Component({
  selector: 'app-transmit',
  templateUrl: './transmit.component.html',
  styleUrls: ['./transmit.component.less']
})
export class TransmitComponent implements OnInit {

  tapesPagination: PaginationDto;
  isMyTapesLoaded: boolean;
  isMyTapesLoading: boolean;
  isPurchaseTapesLoaded: boolean;
  isPurchaseTapesLoading: boolean;
  tapesList = [];
  purchaseTapesList = [];
  purchaseTapesPagination: PaginationDto;
  downloadModal: NzModalRef;

  constructor(
    private seriesService: SeriesService,
    private router: Router,
    private modalService: NzModalService,
    private transmitService: TransmitService,
  ) { }

  ngOnInit() {
    this.isMyTapesLoaded = false;
    this.isMyTapesLoading = true;
    this.tapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.purchaseTapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.seriesService.getAllTapes(this.tapesPagination).pipe(finalize(() => {
      this.isMyTapesLoading = false;
      this.isMyTapesLoaded = true;
    })).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  tapesPageChange(page: number) {
    this.isMyTapesLoading = true;
    this.tapesPagination.page = page;
    this.seriesService.getAllTapes(this.tapesPagination).pipe(finalize(() => {
      this.isMyTapesLoading = false;
    })).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  tapeDetails(program_id: number, id: number, source_type: string) {
    if (source_type === 'online') {
      this.router.navigate([`/manage/series/d/${program_id}/tape`, {tapeId: id, source_type: 'online'}]);
    }
    if (source_type === 'entity') {
      this.router.navigate([`/manage/series/d/${program_id}/tape`, {tapeId: id, source_type: 'entity'}]);
    }
  }

  myTapes() {
    this.isMyTapesLoading = true;
    this.seriesService.getAllTapes(this.tapesPagination).pipe(finalize(() => {
      this.isMyTapesLoading = false;
    })).subscribe(res => {
      this.tapesList = res.list;
      this.tapesPagination = res.pagination;
    });
  }

  purchaseTapes() {
    this.isPurchaseTapesLoaded = false;
    this.isPurchaseTapesLoading = true;
    this.seriesService.purchaseTapes(this.purchaseTapesPagination).pipe(finalize(() => {
      this.isPurchaseTapesLoading = false;
      this.isPurchaseTapesLoaded = true;
    })).subscribe(res => {
      this.purchaseTapesList = res.list;
      this.purchaseTapesPagination = res.pagination;
    });
  }

  purchaseTapesPageChange(page: number) {
    this.isPurchaseTapesLoading = true;
    this.purchaseTapesPagination.page = page;
    this.seriesService.purchaseTapes(this.purchaseTapesPagination).pipe(finalize(() => {
      this.isPurchaseTapesLoading = false;
    })).subscribe(res => {
      this.purchaseTapesList = res.list;
      this.purchaseTapesPagination = res.pagination;
    });
  }

  judge(id: number) {
    this.downloadTape(id);
      // this.seriesService.clientStatus('127.0.0.1:8756').pipe(timeout(5000)).subscribe(z => {
      //   if (z.code === 0) {
      //    this.downloadTape();
      //   } else {
      //     // this.nzMessageService.create('warning', `请先启动客户端`);
      //   }
      // }, err => {
      //   // this.nzMessageService.create('warning', `链接已超时请重新启动客户端`);
      // });
  }

  downloadTape(id: number) {
    this.downloadModal = this.modalService.create({
      nzTitle: '下载母带文件',
      nzContent: TapeDownloadComponent,
      nzComponentParams: { purchaseTapeId: id },
      nzMaskClosable: false,
      nzClosable: false,
      nzOkText: '下载',
      nzCancelText: '关闭',
      nzWidth: 800,
      nzOnOk: this.downloadArgeed
    });
  }

  downloadArgeed = () => new Promise((resolve) => {
    const component = this.downloadModal.getContentComponent() as TapeDownloadComponent;
    const downloadSources = component.getCheckSourceIdList();
    if (downloadSources.length === 0) {
      // this.message.create(type, `请选择要下载的文件`);
    }
    this.transmitService.DownloadTape(downloadSources).subscribe(res => {
      resolve(); // 下载启动客户端返回后关闭选择下载弹窗
    });
    resolve(false);
    // this.router.navigate(['/tape-card']);
  })

}
