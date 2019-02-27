import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../series.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, timeout } from 'rxjs/operators';
import { PaginationDto, MessageService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd';
import { AddPubTapeComponent } from '../add-pub-tape/add-pub-tape.component';

@Component({
  selector: 'app-tape-details',
  templateUrl: './tape-details.component.html',
  styleUrls: ['./tape-details.component.less']
})
export class TapeDetailsComponent implements OnInit {

  id: number;
  tapeDetailsInfo: any;
  tapeFileList = [];
  pubTapeList = [];
  tapeFilePagination: PaginationDto;
  pubTapePagination: PaginationDto;
  tab: number;
  address: string;

  constructor(
    private seriesService: SeriesService,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('tapeId');
        return this.seriesService.getOnlineInfo(this.id);
      })
    ).subscribe(res => {
     this.tapeDetailsInfo = res.data;
    });
    this.tapeFilePagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
    this.pubTapePagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
  }

  TapeFile() {
    this.tab = 1;
    this.seriesService.tapeFileList(this.id, this.tapeFilePagination).subscribe(res => {
      this.tapeFileList = res.data.list;
      this.tapeFilePagination = res.data.pagination;
    });
  }

  pubTape() {
    this.tab = 2;
    this.seriesService.pubTapeList(this.id, this.pubTapePagination).subscribe(res => {
      this.pubTapeList = res.data.list;
      this.pubTapePagination = res.data.pagination;
    });
  }

  pubTapePageChange(page: number) {
    this.pubTapePagination.page = page;
    this.seriesService.pubTapeList(this.id, this.pubTapePagination).subscribe(res => {
      this.pubTapeList = res.data.list;
      this.pubTapePagination = res.data.pagination;
    });
  }

  deletePubTape(id: number) {
    this.seriesService.deletePubTape(this.id, id).subscribe(res => {
      this.message.success(this.translate.instant('global.delete-success'));
      this.seriesService.pubTapeList(this.id, this.pubTapePagination).subscribe(p => {
        this.pubTapeList = p.data.list;
        this.pubTapePagination = p.data.pagination;
      });
    });
  }

  publishTape() {
    this.modalService.create({
      nzTitle: '发行母带',
      nzContent: AddPubTapeComponent,
      nzComponentParams: { id: this.id },
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
        this.seriesService.pubTapeList(this.id, this.pubTapePagination).subscribe(p => {
          this.pubTapeList = p.data.list;
          this.pubTapePagination = p.data.pagination;
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
    this.seriesService.tapeFileList(this.id, this.tapeFilePagination).subscribe(res => {
      this.tapeFileList = res.data.list;
      this.tapeFilePagination = res.pagination;
    });
  }

  uploadTape() {
    this.seriesService.getIpAddress().subscribe(res => {
      this.address = res.data.ip;
      this.seriesService.clientStatus(this.address).pipe(timeout(5000)).subscribe(z => {
        if (z.code === 0) {
          if (this.address.charAt(0) === '1' && this.address.charAt(1) === '2' && this.address.charAt(2) === '7') {
            this.seriesService.UploadTape(this.id, 0).subscribe();
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
