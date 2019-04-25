
import { Component, OnInit, Inject } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { SeriesService } from '../../series.service';
import { switchMap, timeout, tap } from 'rxjs/operators';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { MessageService, PaginationDto } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { AddTapeComponent } from '../../components/add-tape/add-tape.component';
import { AddPubTapeComponent } from '../../components/add-pub-tape/add-pub-tape.component';
import { LocalRequestService } from '@shared/locals';
import { EditTapeInfoComponent } from '../../components/edit-tape-info/edit-tape-info.component';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'app-tape',
  templateUrl: './tape.component.html',
  styleUrls: ['./tape.component.less']
})
export class TapeComponent implements OnInit {

  isId: number;
  id: number;
  tapesList = [];

  tapeDetailsInfo: any;
  tapeFileList = [];
  pubTapeList = [];
  tab: number;
  address: string;
  source_type: string;
  showTape: boolean;
  tapeFilePagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
  pubTapePagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
  constructor(
    private modalService: NzModalService,
    private seriesService: SeriesService,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private router: Router,
    private localRequestService: LocalRequestService,
  ) { }

  ngOnInit() {
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('sid');
        return this.seriesService.getTapeList(this.id);
      })
    ).subscribe(res => {
      this.tapesList = res;
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          this.isId = +params.get('tapeId');
          this.source_type = params.get('source_type');
          if (this.isId === 0) {
            return this.seriesService.getOnlineInfo(this.tapesList[0].id);
          } else {
            return this.seriesService.getOnlineInfo(this.isId);
          }
        })
      ).subscribe(t => {
        this.tapeDetailsInfo = t;
        this.tapeFile();
      });
    });
  }

  pitchOn(id: number, source_type: string) {
    if (source_type === 'online') {
      this.source_type = 'online';
      this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: id, source_type: 'online' }], { relativeTo: this.route });
      this.isId = id;
    }
    if (source_type === 'entity') {
      this.source_type = 'entity';
      this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: id, source_type: 'entity' }], { relativeTo: this.route });
      this.isId = id;
    }
  }

    addTape() {
      const ref = this.modalService.create({
         nzTitle: `新增母带`,
         nzContent: AddTapeComponent,
         nzComponentParams: { id: this.id },
         nzMaskClosable: false,
         nzClosable: false,
         nzFooter: null,
         nzWidth: 800,
       });
       ref.afterClose.subscribe(
         x => {
           this.nzAfterClose();
         }
       );
     }

     nzAfterClose() {
       this.seriesService.getTapeList(this.id).subscribe(res => {
         this.tapesList = res;
         this.tapeFile();
       });
     }

  // addTapeAgreed = (component: AddTapeComponent) => new Promise((resolve) => {
  //   component.formSubmit()
  //     .subscribe(res => {
  //       this.message.success(this.translate.instant('global.add-success'));
  //       this.seriesService.getTapeList(this.id).subscribe(t => {
  //         this.tapesList = t;
  //       });
  //       resolve();
  //     }, error => {
  //       if (error.message) {
  //         this.message.error(error.message);
  //       }
  //     });
  // })

  tapeInfo() {
    this.tab = 0;
  }

  tapeFile() {
    this.tab = 1;
    this.seriesService.tapeFileList(this.isId, this.tapeFilePagination).pipe(tap(x => {
      x.list.forEach(f => {
        if (f.created_at) {
          f.created_at = f.created_at.substring(0, 10);
        }
      });
    })).subscribe(res => {
      console.log(res);
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
    this.modalService.confirm({
      nzTitle: '是否删除本条节目信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deletePubTapeAgreed(id)
    });
  }

  deletePubTapeAgreed = (id: number) => new Promise((resolve) => {
    this.seriesService.deletePubTape(this.isId, id).subscribe(res => {
      this.message.success(this.translate.instant('global.delete-success'));
      this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(p => {
        this.pubTapeList = p.list;
        this.pubTapePagination = p.pagination;
      });
      resolve();
    }, error => {
      if (error.message) {
        this.message.error(error.message);
      }
      resolve(false);
    });
  })
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
      console.log( this.tapeFileList);
      this.tapeFilePagination = res.pagination;
    });
  }

  uploadTape() {
    this.seriesService.getIpAddress().subscribe(res => {
      this.address = res.ip;
      this.localRequestService.status(this.address).pipe(timeout(5000)).subscribe(z => {
        if (this.address.charAt(0) === '1' && this.address.charAt(1) === '2' && this.address.charAt(2) === '7') {
          this.localRequestService.UploadTape(this.isId).subscribe();
          this.router.navigate([`/manage/transmit/historic-record/${this.isId}`]);
        } else {
          // this.localRequestService.getUploadFoldersName(this.address).subscribe(c => {
          //   this.foldersName = c;
          //   this.uploadFoldersNameList();
          // });
        }
      }, err => {
        this.message.success(this.translate.instant('global.start-client'));
      });
    });
  }

  editTape(id: number, source_type: string) {
    this.modalService.create({
      nzTitle: '编辑节目信息',
      nzContent: EditTapeInfoComponent,
      nzComponentParams: { id: id, source_type: source_type },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.editTapeAgreed
    });
  }

  editTapeAgreed = (component: EditTapeInfoComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.seriesService.getTapeList(this.id).subscribe(tl => {
          this.tapesList = tl;
        });
        this.seriesService.getOnlineInfo(this.isId).subscribe(t => {
          this.tapeDetailsInfo = t;
          this.message.success(this.translate.instant('global.edit-success'));
          resolve();
        });
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

}
