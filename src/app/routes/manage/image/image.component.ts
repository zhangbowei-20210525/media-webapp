import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SeriesService } from '../series/series.service';
import { PaginationDto } from '@shared';
import { NzModalRef, NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { finalize, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { ACLAbility } from '@core/acl';
import { LaunchFilmsComponent } from './components/launch-films/launch-films.component';
import { CallUpComponent } from './components/call-up/call-up.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent implements OnInit {
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
  isLoaded: boolean; dataset = [];
  list = [];
  searchText: string;
  company_ids = [];
  isMyDeatilsLoaded: boolean;
  checkedIds: string; // 选择审片的id
  checkedArrayIds = []; // 选择审片的id
  mode: 'figure' | 'table' | 'setting' = 'figure';
  selectedIndex: any;
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  id: any;
  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: SeriesService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchText = params.get('search');
      this.fetchPublicities();
      const id = 1;
    });
  }

  fetchPublicities() {
    this.isLoading = true;
    if (this.mode === 'figure') {
      this.service.getIntentionTypeList(this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isMyDeatilsLoaded = true;
      }))
      .subscribe(result => {
        this.list = result.list;
        this.pagination = result.pagination;
        console.log(this.list);
      });
    }
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

  publicityPlay(id: number, sid: number) {
    this.router.navigate([`/manage/image/image-details/${id}`, { sid: sid }]);
  }
  // 发起审片弹框
  launchFilms() {
    this.modalService.create({
      nzTitle: `发起审片`,
      nzContent: LaunchFilmsComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 440,
      nzOkText: '提交',
      nzCancelText: '取消',
      nzOnOk: () => new Promise((resolve) => {
        resolve();
        this.router.navigate([`/manage/image/verify-films`]);
      }),
      nzNoAnimation: true,
    });
  }
  // 发起样片征集令弹框
  callUp() {
    this.modalService.create({
      // nzTitle: `发起审片`,
      nzContent: CallUpComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzCancelText: '关闭',
      nzNoAnimation: true,
      nzOkText: '确定',
      nzOnOk: () => new Promise((resolve) => {
        resolve();
          this.router.navigate([`/manage/image/details-solicitation`]);
      })
    });
  }

  // 进入一审页面
  firstCheck() {
    this.router.navigate([`/manage/image/films-details`]);
  }
  // 设置面板改变
  onSelectChange(event) {
    this.selectedIndex = event.index;
  }
}
