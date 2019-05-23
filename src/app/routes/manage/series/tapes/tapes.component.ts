import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PaginationDto, AccountService } from '@shared';
import { SeriesService } from '../series.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AddTapeComponent } from '../components/add-tape/add-tape.component';
import { TranslateService } from '@ngx-translate/core';
import { finalize, timeout, switchMap } from 'rxjs/operators';
import { LocalRequestService } from '@shared/locals';
import { fadeIn } from '@shared/animations';
import * as _ from 'lodash';
import { ACLAbility } from '@core/acl';

@Component({
  selector: 'app-tapes',
  templateUrl: './tapes.component.html',
  styleUrls: ['./tapes.component.less'],
  animations: [fadeIn]
})
export class TapesComponent implements OnInit {

  isLoaded = false;
  isLoading = false;
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  dataset = [];
  searchText: string;

  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: SeriesService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
    private localRequestService: LocalRequestService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchText = params.get('search');
      this.fetchPublicities();
    });
  }

  // fetchPublicities() {
  //   this.isLoading = true;
  //   this.route.paramMap.pipe(
  //     switchMap((params: ParamMap) => {
  //       this.search = params.get('search');
  //       console.log(this.search);
  //       if (this.search === null) {
  //         return this.service.getAllTapes(this.pagination);
  //       } else {
  //         return this.service.getSearchAllTapes(this.search, this.pagination);
  //       }
  //     })).pipe(finalize(() => {
  //       this.isLoading = false;
  //       if (!this.isLoaded) {
  //         this.isLoaded = true;
  //       }
  //     }))
  //     .subscribe(result => {
  //       this.dataset = result.list;
  //       this.pagination = result.pagination;
  //     });
  // }

  fetchPublicities() {
    const q = _.isString(this.searchText) ? this.searchText : '';
    this.isLoading = true;
    this.service.searchAllTapes(q, this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
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
    this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: tapeId, source_type: source_type }]);
  }

  addTape() {
    const ref = this.modal.create({
      nzTitle: `新增母带`,
      nzContent: AddTapeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzFooter: null,
      nzWidth: 800,
      // nzOnOk: this.addTapeAgreed
    });
    ref.afterClose.subscribe(
      x => {
        this.nzAfterClose();
      }
    );
  }

  nzAfterClose() {
    console.log('222');
    this.fetchPublicities();
  }

  // addTapeAgreed = (component: AddTapeComponent) => new Promise((resolve) => {
  //   component.formSubmit()
  //     .subscribe(res => {
  //       if (component.tapeVersion === 'online') {
  //         this.modal.confirm({
  //           nzTitle: '是否需要上传母带文件?',
  //           nzOkText: '上传',
  //           nzCancelText: '取消',
  //           nzOkType: 'primary',
  //           nzOnOk: () => this.uploadTape(res.id)
  //         });
  //       }
  //       this.message.success(this.translate.instant('global.add-success'));
  //       this.fetchPublicities();
  //       resolve();
  //     }, error => {
  //       if (error.message) {
  //         this.message.error(error.message);
  //       }
  //     });
  // })


  // uploadTape = (id: number) => new Promise((resolve) => {
  //    this.service.getIpAddress().subscribe(res => {
  //   const address = res.ip;
  //   this.localRequestService.status(address).pipe(timeout(5000)).subscribe(z => {
  //     if (address.charAt(0) === '1' && address.charAt(1) === '2' && address.charAt(2) === '7') {
  //       this.localRequestService.UploadTape(id).subscribe();
  //       this.router.navigate([`/manage/transmit/download-record/${id}`]);
  //     } else {
  //     }
  //   }, err => {
  //     this.message.success(this.translate.instant('global.start-client'));
  //   });
  // });
  // })


  deleteTape(id: number) {
    this.modal.confirm({
      nzTitle: '是否删除本条母带信息?',
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
