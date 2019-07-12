import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SeriesService } from '../series.service';
import { PaginationDto } from '@shared';
import { NzModalRef, NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { AddPublicityComponent } from '../components/add-publicity/add-publicity.component';
import { finalize, switchMap } from 'rxjs/operators';
import { fadeIn } from '@shared/animations';
import { QueueUploader } from '@shared/upload';
import { PublicityService } from '../details/publicity/publicity.service';
import * as _ from 'lodash';
import { ACLAbility } from '@core/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'app-publicities',
  templateUrl: './publicities.component.html',
  styleUrls: ['./publicities.component.less'],
  animations: [fadeIn]
})
export class PublicitiesComponent implements OnInit {
  @ViewChild('publicityOk') publicityOk: any;
  readonly fileFilters = ['mp4', 'wmv', 'rmvb', 'mkv', 'mov', 'avi', 'mpg'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  allChecked = false;
  indeterminate = false;
  disabledButton: boolean;
  pagination = { page: 1, page_size: 12 } as PaginationDto;
  addPublicityModal: NzModalRef;
  publicityId: number;
  isLoading: boolean;
  isLoaded: boolean;
  mode: 'figure' | 'table' = 'figure';
  dataset = [];
  list = [];
  searchText: string;
  company_ids = [];
  isPublicities: boolean;

  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: SeriesService,
    private pservice: PublicityService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private uploader: QueueUploader,
    private notification: NzNotificationService,
    private ps: PublicityService,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchText = params.get('search');
      this.fetchPublicities();
    });
  }

  fetchPublicities() {
    const mode = this.mode;
    const q = _.isString(this.searchText) ? this.searchText : '';
    this.isLoading = true;
    this.isLoaded = false;
    (mode === 'table' ?
      this.service.searchPublicities(q, this.pagination) :
      this.service.searchThumbnail(q, this.pagination))
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
        this.isPublicities = true;
      }))
      .subscribe(result => {
        if (mode === 'table') {
          this.dataset = result.list;
        } else {
          this.list = result.list;
        }
        this.pagination = result.pagination;
      });
  }

  modeChange() {
    this.fetchPublicities();
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.fetchPublicities();
  }

  refreshStatus(): void {
    const allChecked = this.dataset.every(value => value.checked === true);
    const allUnChecked = this.dataset.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataset.some(value => value.checked);
  }

  checkedChange() {
    this.refreshStatus();
  }

  checkAll(value: boolean): void {
    this.dataset.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  publicityDetails(id) {
    this.router.navigate([`/manage/series/d/${id}/publicityd`]);
  }

  addPublicity() {
    this.addPublicityModal = this.modal.create({
      nzTitle: '新增宣发',
      nzContent: AddPublicityComponent,
      nzMaskClosable: true,
      nzClosable: true,
      nzOkText: null,
      nzCancelText: '取消',
      nzWidth: 800,
      nzFooter: this.publicityOk
    });
  }

  upload(sid: number, list: File[], materielType: string) {
    this.service.getPublicitiesList(sid).subscribe(result => {
      console.log(result);
      this.publicityId = result.list[0].id;
      list.map(item => {
        if (
          (materielType === 'feature' && item.size < 3221225472) ||
          (materielType === 'sample' && item.size < 3221225472) ||
          (materielType === 'trailer' && item.size < 3221225472) ||
          (materielType === 'poster' && item.size < 2097152) ||
          (materielType === 'still' && item.size < 2097152) ||
          (materielType === 'pdf' && item.size < 2097152)
          ) {
            const dotIndex = item.name.lastIndexOf('.');
            return this.uploader.enqueue({
              target: this.publicityId,
              url: this.ps.getUploadUrl(materielType),
              file: item,
              name: item.name.substring(0, dotIndex),
              extension: item.name.substring(dotIndex + 1, item.name.length),
              size: item.size,
              progress: 0,
              createAt: new Date,
              success: (obj, data) => {
                if (data.code === '0') {
                  this.pservice.bindingMateriel(obj.target, data.data.extension, data.data.filename, data.data.name, data.data.size,
                    materielType, this.company_ids).subscribe(() => {
                      this.notification.success('上传文件完成', `上传物料 ${obj.name} 成功`);
                    });
                  return true;
                } else {
                  this.notification.error('上传文件失败', `${data.detail}`);
                }
              }
            });
        } else {
          this.message.warning('所传文件大小超出指定范围（视频文件不大于3GB，图片、PDF不大于2MB）');
        }
      });
    });
    this.fetchPublicities();

  }

  publicityUpload(event) {
    const component = this.addPublicityModal.getContentComponent() as AddPublicityComponent;
    if (component.validation()) {
      if (component.checkChange().length === 0) {
        this.company_ids = [''];
      } else {
        component.checkChange().forEach(x => this.company_ids.push(x.value));
      }
      this.addPublicityModal.close();
      const value = component.getValue();
      let fileList: FileList, folder: string;
      try {
        fileList = event.target.files as FileList;
        folder = ((fileList[0] as any).webkitRelativePath as string).split('/')[0];
      } catch (ex) {
        return;
      }
      const list = [] as File[];
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList.item(index);
        this.ps.getFilters(value.type).forEach(filter => {
          if (element.name.toLowerCase().endsWith(filter)) {
            list.push(element);
            return;
          }
        });
      }
      if (list.length < 1) {
        this.message.warning(this.translate.instant('global.no-valid-file'));
        return;
      }
      if (+value.id > 0) {
        this.upload(value.id, list, value.type);
      } else {
        this.service.addSeries({ name: value.program_name, program_type: value.program_type }).subscribe(s => {
          this.upload(s.id, list, value.type);
        });
      }
    }
  }

  publicityPlay(id, sid: number) {
    console.log(id);
    // localStorage.setItem('shareId', id);
    this.router.navigate([`/manage/series/publicity-details/${id}`, { sid: sid }]);
  }
}
