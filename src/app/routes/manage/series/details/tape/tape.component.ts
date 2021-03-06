import { Component, OnInit, Inject, OnDestroy, } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { SeriesService } from '../../series.service';
import { switchMap, timeout, tap, count } from 'rxjs/operators';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { MessageService, PaginationDto } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { AddTapeComponent } from '../../components/add-tape/add-tape.component';
import { DeleteTapeComponent } from '../../components/delete-tape/delete-tape.component';
import { AddPubTapeComponent } from '../../components/add-pub-tape/add-pub-tape.component';
import { LocalRequestService } from '@shared/locals';
import { EditTapeInfoComponent } from '../../components/edit-tape-info/edit-tape-info.component';
// import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLAbility } from '@core/acl';
import { NotifiesPolling } from '@core/notifies';
import { error } from '@angular/compiler/src/util';
import { DeliveryCopyrightComponent } from '../../components/delivery-copyright/delivery-copyright.component';

@Component({
  selector: 'app-tape',
  templateUrl: './tape.component.html',
  styleUrls: ['./tape.component.less']
})
export class TapeComponent implements OnInit, OnDestroy {

  isId: number;
  id: number;
  tapesList = [];
  source_data: any;
  tapeDetailsInfo: any;
  tapeFileList = [];
  pubTapeList = [];
  tab: number;
  address: string;
  source_type: string;
  showTape: boolean;
  tapeFilePagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
  pubTapePagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
  isActive: any;
  // getHash: any;
  // getIp: any;
  // TapePage: any;
  constructor(
    public ability: ACLAbility,
    private modalService: NzModalService,
    private seriesService: SeriesService,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private router: Router,
    private localRequestService: LocalRequestService,
    private ntf: NotifiesPolling,
  ) { }

  ngOnInit() {
    this.tab = 0;
    this.route.parent.paramMap.subscribe(params => {
      this.id = +params.get('sid');
      this.seriesService.getTapeList(this.id).subscribe(res => {
        // console.log(res);
        this.tapesList = res;
        this.route.paramMap.subscribe(tapeParams => {
          this.isId = +tapeParams.get('tapeId');
          this.ntf.setIsActiveSourceFileStatus(true, this.isId);
          this.source_type = tapeParams.get('source_type');
          if (this.isId === 0) {
            if (this.tapesList.length > 0) {
              this.isId = this.tapesList[0].id;
              this.seriesService.getOnlineInfo(this.tapesList[0].id).subscribe(t => {
                  this.tapeDetailsInfo = t;
                }
              );
              this.getTapeFileList();
            }
          } else {
            this.seriesService.getOnlineInfo(this.isId).subscribe(t =>
              this.tapeDetailsInfo = t
            );
            this.getTapeFileList();
          }
        });
      });
    });
    this.ntf.notifies().subscribe(result => {
      this.tapeFileList.forEach(item => {
        const file = result.source_files.find(f => f.id === item.id);
        if (file) {
          item.local_file_status = file.local_file_status;
          item.hashlink_file_status = file.hashlink_file_status;
        }
      });
    });
    this.ntf.nextNotifies();
  }
  getTapeFileList() {
    this.seriesService.tapeFileList(this.isId, this.tapeFilePagination).pipe(tap(x => {
      // this.TapePage = x.pagination;
      x.list.forEach(f => {
        // this.getHash = f.hash;
        // this.getIp = f.ip;
        // console.log(f);
        if (f.created_at) {
          f.created_at = f.created_at.substring(0, 10);
        }
      });
      this.isActive = x.list.every(item => {
        return item.local_file_status === '';
      });
    })).subscribe(x => {
      this.tapeFileList = x.list;
      this.tapeFilePagination = x.pagination;
    });
  }

  tapeFile() {
    this.tab = 0;
    this.seriesService.tapeFileList(this.isId, this.tapeFilePagination).pipe(tap(x => {
      x.list.forEach(f => {
        if (f.created_at) {
          f.created_at = f.created_at.substring(0, 10);
        }
      });
    })).subscribe(res => {
      // console.log(res, 'jjjj');
    });
  }

  pitchOn(id: number, source_type: string) {
    if (source_type === 'online') {
      this.tab = 0;
      this.source_type = 'online';
      // this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: id, source_type: 'online' }]);
      this.isId = id;
      this.seriesService.tapeFileList(id, this.tapeFilePagination).pipe(tap(x => {
        // this.TapePage = x.pagination;
        x.list.forEach(f => {
          // this.getHash = f.hash;
          // this.getIp = f.ip;
          // console.log(f);
          if (f.created_at) {
            f.created_at = f.created_at.substring(0, 10);
          }
        });
        this.isActive = x.list.every(item => {
          return item.local_file_status === '';
        });
      })).subscribe(x => {
        this.tapeFileList = x.list;
        this.tapeFilePagination = x.pagination;
      });
    }
    if (source_type === 'entity') {
      this.source_type = 'entity';
      // this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: id, source_type: 'entity' }]);
      this.isId = id;
      this.seriesService.getOnlineInfo(this.isId).subscribe(t => {
        this.tapeDetailsInfo = t;
      });
      // this.seriesService.tapeFileList(id, this.tapeFilePagination).pipe(tap(x => {
      //   // this.TapePage = x.pagination;
      //   x.list.forEach(f => {
      //     // this.getHash = f.hash;
      //     // this.getIp = f.ip;
      //     // console.log(f);
      //     if (f.created_at) {
      //       f.created_at = f.created_at.substring(0, 10);
      //     }
      //   });
      //   this.isActive = x.list.every(item => {
      //     console.log(item);
      //     return item.local_file_status === '';
      //   });
      // })).subscribe(x => {
      //   this.tapeFileList = x.list;
      //   this.tapeFilePagination = x.pagination;
      // });
    }
  }

  addTape() {
    const ref = this.modalService.create({
      nzTitle: `????????????`,
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
    if (this.isId > 0) {
      this.seriesService.getTapeList(this.id).subscribe(res => {
        this.tapesList = res;
        this.tapeFile();
      });
    }
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


  pubTape() {
    this.tab = 1;
    this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(res => {
      this.pubTapeList = res;
      this.pubTapePagination = res.pagination;
    });
  }

  pubTapePageChange(page: number) {
    this.pubTapePagination.page = page;
    this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(res => {
      this.pubTapeList = res;
      this.pubTapePagination = res.pagination;
    });
  }


  deletePubTape(id: number, i: number) {
    this.modalService.confirm({
      nzTitle: '???????????????????????????????',
      nzOkText: '??????',
      nzCancelText: '??????',
      nzOkType: 'danger',
      nzOnOk: () => this.deletePubTapeAgreed(id, i)
    });
  }

  deletePubTapeAgreed = (id: number, i: number) => new Promise((resolve) => {
    this.seriesService.deletePubTape(id).subscribe(res => {
      this.message.success(this.translate.instant('global.delete-success'));
      if (this.pubTapePagination.pages === this.pubTapePagination.page) {
        if (this.pubTapePagination.page === 1) { } else {
          if ( i === 0 ) {
            this.pubTapePagination.page = this.pubTapePagination.page - 1;
          }
        }
      }
      this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(p => {
        this.pubTapeList = p;
        this.pubTapePagination = p.pagination;
      });
      resolve();
    }, err => {
      if (err.message) {
        this.message.error(err.message);
      }
      resolve(false);
    });
  })
  publishTape() {
    this.modalService.create({
      nzTitle: '????????????',
      nzContent: AddPubTapeComponent,
      nzComponentParams: { id: this.isId },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addPubTapeAgreed
    });
  }

  addPubTapeAgreed = (component: AddPubTapeComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(res => {
          this.message.success(this.translate.instant('global.add-success'));
          this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(p => {
            this.pubTapeList = p;
            this.pubTapePagination = p.pagination;
          });
          resolve();
        }, err => {
          reject(false);
        });
    } else {
      reject(false);
    }
  })

  deliveryCopyright() {
    this.modalService.create({
      nzTitle: '????????????',
      nzContent: DeliveryCopyrightComponent,
      nzComponentParams: { id: this.isId },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.deliveryCopyrightAgreed
    });
  }

  deliveryCopyrightAgreed = (component: DeliveryCopyrightComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit()
        .subscribe(res => {
          this.message.success(this.translate.instant('?????????????????????'));
          this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(p => {
            this.pubTapeList = p;
            this.pubTapePagination = p.pagination;
          });
          resolve();
        }, err => {
          reject(false);
        });
    } else {
      reject(false);
    }
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
      this.localRequestService.status(this.address).pipe(timeout(5000)).subscribe(z => {
        if (this.address.charAt(0) === '1' && this.address.charAt(1) === '2' && this.address.charAt(2) === '7') {
          this.localRequestService.uploadTape(this.isId).subscribe();
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
      nzTitle: '??????????????????',
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
      }, err => {
        if (err.message) {
          this.message.error(err.message);
        }
      });
  })
  // ?????? ?????????????????????(????????????)
  deleteTape(id: number , i: number) {
    this.modalService.confirm({
      nzTitle: '???????????????????????????????',
      nzOkText: '??????',
      nzCancelText: '??????',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteTapeAgreed(id, i)
    });
  }
  deleteTapeAgreed(id: number, i: number) {
    this.seriesService.deleteTapeSave(id).subscribe(res => {
      if (this.tapeFilePagination.pages === this.tapeFilePagination.page) {
        if (this.tapeFilePagination.page === 1) { } else {
          if ( i === 0 ) {
            this.tapeFilePagination.page = this.tapeFilePagination.page - 1;
          }
        }
      }
      this.message.success('????????????');
      this.getTapeFileList();
    });
  }
  // ??????????????????
  deteleAllTape() {
    this.modalService.create({
      nzTitle: `???????????????????????????`,
      nzContent: DeleteTapeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 340,
      nzOkText: '??????',
      nzCancelText: '??????',
      nzOnOk: this.deleteTapeAllFilesAgreed,
      nzNoAnimation: true,
    });
  }
  // ?????????????????????
  deleteTapeAllFilesAgreed = (component: DeleteTapeComponent) => new Promise((resolve, reject) => {
    if (component.source_data === 'onlineSave') {
      this.deleteOnlineSave(this.isId);
    } else {
      this.deleteTapeAllLocal(this.isId);
    }
    resolve();
    reject(false);
  })
  // ???????????????????????????
  deleteTapeAllLocal(id) {
    this.localRequestService.deleteTapeLocalFile(id).subscribe(res => {
      this.message.success('???????????????');
      this.getTapeFileList();
    }, err => {
      this.message.error('????????????');
    });
  }
  // ????????????????????????
  deleteOnlineSave(id) {
    this.seriesService.deleteOnlineStorage(id).subscribe(res => {
      this.message.success('???????????????');
      this.getTapeFileList();
    }, err => {
      this.message.error('????????????');
    });
  }

  ngOnDestroy() {
    this.ntf.setIsActiveSourceFileStatus(false);
  }
}
