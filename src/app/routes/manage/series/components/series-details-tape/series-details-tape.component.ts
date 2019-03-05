import { Component, OnInit } from '@angular/core';
import { AddTapeComponent } from '../add-tape/add-tape.component';
import { NzModalService } from 'ng-zorro-antd';
import { SeriesService } from '../../series.service';
import { switchMap, timeout } from 'rxjs/operators';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { MessageService, PaginationDto } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { AddPubTapeComponent } from '../add-pub-tape/add-pub-tape.component';

@Component({
  selector: 'app-series-details-tape',
  templateUrl: './series-details-tape.component.html',
  styleUrls: ['./series-details-tape.component.less']
})
export class SeriesDetailsTapeComponent implements OnInit {

  isId: number;
  id: number;
  tapesList = [];

  tapeDetailsInfo: any;
  tapeFileList = [];
  pubTapeList = [];
  tapeFilePagination: PaginationDto;
  pubTapePagination: PaginationDto;
  tab: number;
  address: string;
  source_type: string;

  constructor(
    private modalService: NzModalService,
    private seriesService: SeriesService,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('sid');
        return this.seriesService.getTapeList(this.id);
      })
    ).subscribe(res => {
      this.tapesList = res;
    });

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.isId = +params.get('tapeId');
        this.source_type = params.get('source_type');
        return this.seriesService.getOnlineInfo(this.isId);
      })
    ).subscribe(res => {
     this.tapeDetailsInfo = res;
    });
    this.tapeFilePagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
    this.pubTapePagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;

  }

  pitchOn(id: number, source_type: string) {
    if (source_type === 'online') {
      this.source_type = 'online';
      this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: id, source_type: 'online' }]);
      this.isId = id;
    }
    if (source_type === 'entity') {
      this.source_type = 'entity';
      this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: id, source_type: 'entity'}]);
      this.isId = id;
    }
  }

  addTape() {
    this.modalService.create({
      nzTitle: `新增母带`,
      nzContent: AddTapeComponent,
      nzComponentParams: { id: this.id },
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
        this.seriesService.getTapeList(this.id).subscribe(t => {
          this.tapesList = t;
        });
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  tapeInfo() {
    this.tab = 0;
  }

  TapeFile() {
    this.tab = 1;
    this.seriesService.tapeFileList(this.isId, this.tapeFilePagination).subscribe(res => {
      this.tapeFileList = res.list;
      this.tapeFilePagination = res.pagination;
    });
  }

  pubTape() {
    this.tab = 2;
    this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(res => {
      this.pubTapeList = res.list;
      this.pubTapePagination = res.pagination;
    });
  }

  pubTapePageChange(page: number) {
    this.pubTapePagination.page = page;
    this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(res => {
      this.pubTapeList = res.list;
      this.pubTapePagination = res.pagination;
    });
  }

  deletePubTape(id: number) {
    this.seriesService.deletePubTape(this.isId, id).subscribe(res => {
      this.message.success(this.translate.instant('global.delete-success'));
      this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(p => {
        this.pubTapeList = p.list;
        this.pubTapePagination = p.pagination;
      });
    });
  }

  publishTape() {
    this.modalService.create({
      nzTitle: '发行母带',
      nzContent: AddPubTapeComponent,
      nzComponentParams: { id: this.isId },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addPubTapeAgreed
    });
  }

  addPubTapeAgreed = (component: AddPubTapeComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
        this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(p => {
          this.pubTapeList = p.list;
          this.pubTapePagination = p.pagination;
        });
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  tapeFilePageChange(page: number) {
    this.tapeFilePagination.page = page;
    this.seriesService.tapeFileList(this.isId, this.tapeFilePagination).subscribe(res => {
      this.tapeFileList = res.list;
      this.tapeFilePagination = res.pagination;
    });
  }

  uploadTape() {
    this.seriesService.getIpAddress().subscribe(res => {
      this.address = res.ip;
      this.seriesService.clientStatus(this.address).pipe(timeout(5000)).subscribe(z => {
        if (z.code === 0) {
          if (this.address.charAt(0) === '1' && this.address.charAt(1) === '2' && this.address.charAt(2) === '7') {
            this.seriesService.UploadTape(this.isId, 0).subscribe();
          } else {
            // this.localApplicationService.getUploadFoldersName(this.address).subscribe(c => {
            //   this.foldersName = c;
            //   this.uploadFoldersNameList();
            // });
          }
        } else {
          // this.message.success(this.translate.instant('请先启动客户端'));
        }
      }, err => {
        // this.message.success('warning', `链接已超时请重新启动客户端`);
      });
   });
  }
}
