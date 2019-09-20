import { Component, OnInit, Inject } from '@angular/core';
import { PaginationDto, MessageService } from '@shared';
import { finalize, timeout, switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SeriesService } from '../../series/series.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { LocalRequestService } from '@shared/locals';
import { fadeIn } from '@shared/animations';
import { TranslateService } from '@ngx-translate/core';
import { TapeDownloadComponent } from '../components/tape-download/tape-download.component';
import { TransmitService } from '../transmit.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.less'],
  animations: [fadeIn],
})
export class TypeComponent implements OnInit {
  isMyTapesLoaded = false;
  isMyTapesLoading = true;
  tapesPagination: PaginationDto;
  purchaseTapesPagination: PaginationDto;
  tabIndex: number;
  isPurchaseTapesLoaded: boolean;
  isPurchaseTapesLoading: boolean;
  purchaseTapesList = [];
  state: string;

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private router: Router,
    private service: TransmitService,
    private modalService: NzModalService,
    private localRequestService: LocalRequestService,
    private message: MessageService,
    private translate: TranslateService,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,

  ) { }

  ngOnInit() {
    this.service.eventEmit.subscribe((value: any) => {
      if (value === 'noticeMessage') {
        this.purchaseTapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
        this.purchaseTapes();
      }
    });

    this.isMyTapesLoaded = true;
    this.isMyTapesLoading = true;
    this.tapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.purchaseTapesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.tabIndex = +params.get('tabIndex');
        return this.seriesService.getAllTapes(this.tapesPagination);
      })).pipe(finalize(() => {
        this.isMyTapesLoading = false;
        this.isMyTapesLoaded = true;
      })).subscribe(res => {
        this.tapesPagination = res.pagination;
      });
    this.purchaseTapes();
  }

  tapesPageChange(page: number) {
    this.isMyTapesLoading = true;
    this.tapesPagination.page = page;
    this.seriesService.getAllTapes(this.tapesPagination).pipe(finalize(() => {
      this.isMyTapesLoading = false;
    })).subscribe(res => {
      this.tapesPagination = res.pagination;
    });
  }

  tapeDetails(program_id: number, id: number, source_type: string) {
    if (source_type === 'online') {
      this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: id, source_type: 'online' }]);
    }
    if (source_type === 'entity') {
      this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: id, source_type: 'entity' }]);
    }
  }

  myTapes() {
    this.isMyTapesLoading = true;
    this.seriesService.getAllTapes(this.tapesPagination).pipe(finalize(() => {
      this.isMyTapesLoading = false;
    })).subscribe(res => {
      this.tapesPagination = res.pagination;
    });
  }

  purchaseTapes() {
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
    this.localRequestService.status('127.0.0.1:8756').pipe(timeout(5000)).subscribe(z => {
      this.state = 'bd';
      this.downloadTape(id);
    }, err => {
      this.message.success(this.translate.instant('global.start-client'));
    });
  }

  remote(id: number) {
    this.service.remoteValidation().subscribe(result => {
      if (result === null) {
        this.message.success(this.translate.instant('远程客户端已离线'));
      } else {
        if (result.online_status === true) {
          this.state = 'yc';
          this.downloadTape(id);
        } else {
          this.message.success(this.translate.instant('远程客户端已离线'));
        }
      }
    });
  }

  purTapeDetails(id: number) {
    this.router.navigate([`/manage/transmit/pur-d/${id}`]);
  }

  downloadTape(id: number) {
    this.modalService.create({
      nzTitle: '下载母带文件',
      nzContent: TapeDownloadComponent,
      nzComponentParams: { purchaseTapeId: id, state: this.state },
      nzMaskClosable: false,
      nzClosable: false,
      nzOkText: '下载',
      nzCancelText: '关闭',
      nzWidth: 800,
      nzOnOk: this.downloadArgeed
    });
  }

  downloadArgeed = (component: TapeDownloadComponent) => new Promise((resolve) => {
    const downloadSources = component.getCheckSourceIdList();
    if (downloadSources.length === 0) {
      this.message.success(this.translate.instant('global.select-download-file'));
      resolve();
    } else {
      if (this.state === 'bd') {
        this.localRequestService.downloadTape(downloadSources).subscribe(res => {
          resolve();
        });
      }
      if (this.state === 'yc') {
        this.service.remoteDownloadTape('download', this.token.get().token, downloadSources).subscribe(res => {
          resolve();
        });
      }
    }
  })

}
