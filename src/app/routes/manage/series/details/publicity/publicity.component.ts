import { Component, OnInit } from '@angular/core';
import { MessageService, PaginationDto } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from '../../series.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, finalize } from 'rxjs/operators';
import { PublicityService } from './publicity.service';
import { NzTabChangeEvent, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { QueueUploader } from '@shared/upload';
import { LocalRequestService } from '@shared/locals';

declare type MaterielType = 'sample' | 'feature' | 'trailer' | 'poster' | 'still' | 'pdf';

@Component({
  selector: 'app-publicity',
  templateUrl: './publicity.component.html',
  styleUrls: ['./publicity.component.less']
})
export class PublicityComponent implements OnInit {

  [key: string]: any;

  readonly materielTypes = ['sample', 'feature', 'trailer', 'poster', 'still', 'pdf'] as MaterielType[]; // 根据视图的顺序

  selectedIndex = 0;
  seriesId: number;
  publicityId: number;
  publicity: any;
  tabIndex: number;

  constructor(
    private message: MessageService,
    private notification: NzNotificationService,
    private translate: TranslateService,
    private service: PublicityService,
    private route: ActivatedRoute,
    private router: Router,
    private uploader: QueueUploader,
    private modal: NzModalService,
    private seriesService: SeriesService
  ) {
    this.materielTypes.forEach(item => {
      this[this.getLoadedString(item)] = false;
      this[this.getLoadingString(item)] = false;
      this[this.getListString(item)] = [];
      this[this.getPaginationString(item)] = { page: 1, page_size: 99999 } as PaginationDto;
    });
  }

  getLoadedString(type: string) {
    return 'is' + type[0].toUpperCase() + type.substring(1, type.length - 1) + 'Loaded';
  }

  getLoadingString(type: string) {
    return 'is' + type[0].toUpperCase() + type.substring(1, type.length - 1) + 'Loading';
  }

  getListString(type: string) {
    return type + 'List';
  }

  getPaginationString(type: string) {
    return type + 'Pagination';
  }

  ngOnInit() {
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.seriesId = +params.get('sid');
        return this.service.getPublicities(this.seriesId);
      })).subscribe(result => {
        this.publicityId = result.list[0].id;
        this.fetchPublicity();
        this.fetchMateriels(this.materielTypes[0]);
      });
  }

  fetchPublicity() {
    this.service.getPublicity(this.publicityId).subscribe(result => {
      this.publicity = result;
    });
  }

  fetchMateriels(type: string) {
    const loadingString = this.getLoadingString(type);
    const paginationString = this.getPaginationString(type);
    this[loadingString] = true;
    this.service.getMateriels(this.publicityId, type, this[paginationString])
      .pipe(finalize(() => {
        this[loadingString] = false;
        this[this.getLoadedString(type)] = true;
      })).subscribe(result => {
        this[this.getListString(type)] = result.list;
        this[paginationString] = result.pagination;
      });
  }

  publicityViews() {
    this.router.navigate([`/manage/series/publicity-details/${this.publicityId}`, { sid: this.seriesId, tabIndex: this.tabIndex  }]);
  }

  pageChange(page: number, type: MaterielType) {
    this[this.getPaginationString(type)].page = page;
    this.fetchMateriels(type);
  }

  tabSelectChange(event: NzTabChangeEvent) {
    this.tabIndex  =  event.index;
    this.fetchMateriels(this.materielTypes[event.index]);
  }

  filesChange(event: Event) {
    const materielType = this.materielTypes[this.selectedIndex];
    const filters = this.service.getFilters(materielType);
    const files = event.target['files'] as FileList;
    const list = [] as File[];
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        const element = files[key];
        filters.forEach(filter => {
          if (element.name.toLowerCase().endsWith(filter)) {
            list.push(element);
            return;
          }
        });
      }
    }
    if (list.length < 1) {
      this.message.warning('无有效文件，请重新选择');
    }
    const uploads = list.map(item => {
      const dotIndex = item.name.lastIndexOf('.');
      return this.uploader.enqueue({
        target: this.publicityId,
        url: this.service.getUploadUrl(materielType),
        file: item,
        name: item.name.substring(0, dotIndex),
        extension: item.name.substring(dotIndex + 1, item.name.length),
        size: item.size,
        progress: 0,
        createAt: new Date,
        success: (upload, data) => {
          this.service.bindingMateriel(upload.target, data.id, materielType).subscribe(result => {
            this.notification.success('上传文件完成', `上传物料 ${upload.name} 成功`);
            this.fetchMateriels(materielType);
            this.fetchPublicity();
          });
          return true;
        }
      });
    });
    // const listString = this.getListString(materielType);
    // this[listString] = [...this[listString], ...uploads];
  }

  deletePublicity(id: number) {
    this.modal.confirm({
      nzTitle: '是否删除本条节目信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deletePublicityAgreed(id)
    });
  }

  deletePublicityAgreed = (id: number) => new Promise((resolve) => {
    this.seriesService.deletePublicity(this.publicityId,  this.materielTypes[this.selectedIndex], id).subscribe(res => {
      this.message.success(this.translate.instant('global.delete-success'));
      this.fetchMateriels(this.materielTypes[this.selectedIndex]);
      resolve();
    }, error => {
      if (error.message) {
        this.message.error(error.message);
      }
      resolve(false);
    });
  })

}
