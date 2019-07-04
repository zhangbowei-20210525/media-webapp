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
  checkedIntentionIds = []; // 选择审片的id
  checkedArrayIds = []; // 选择审片的id
  mode: 'figure' | 'table' = 'figure';
  selectedIndex = 0;
  oneInstanceList = [];
  intentionList = [];
  reviewList = [];
  // 意向
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  // 一审
  isFirstAllDisplayDataChecked = false;
  isFirstIndeterminate = false;
  firstListOfDisplayData: any[] = [];
  firstMapOfCheckedId: { [key: string]: boolean } = {};
  // 二审
  isSecondAllDisplayDataChecked = false;
  isSecondIndeterminate = false;
  secondListOfDisplayData: any[] = [];
  secondMapOfCheckedId: { [key: string]: boolean } = {};
  // 三审
  isThreeAllDisplayDataChecked = false;
  isThreeIndeterminate = false;
  threeListOfDisplayData: any[] = [];
  threeMapOfCheckedId: { [key: string]: boolean } = {};
  id: any;
  intention_id: any;
  checkedFirstIds = [];
  paginationName: any;
  intentonName = [];
  oneReview: any;
  reviewIdList = [];
  reviewId: any;
  selectedTabIndex = 0;
  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: SeriesService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private message: NzMessageService,

  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchText = params.get('search');
      this.fetchPublicities(this.selectedIndex);
    });
  }
  fetchPublicities(step_number) {
    this.isLoading = true;
    if (this.mode === 'figure') {
      this.service.getReviewView(this.pagination)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.isMyDeatilsLoaded = true;
        }))
        .subscribe(result => {
          this.list = result.list;
          this.pagination = result.pagination;
          // console.log(this.list);
        });
    } else if (this.mode === 'table') {
      if (step_number === 0) {
        this.service.getIntentionTypeList(this.pagination)
          .pipe(finalize(() => {
            this.isLoading = false;
            this.isMyDeatilsLoaded = true;
          }))
          .subscribe(result => {
            this.intentionList = result.list;
            this.pagination = result.pagination;
            // this.paginationName = result.pagination.name;
            // console.log(result);
          });
      } else {
        this.service.getReviewList(this.pagination, step_number).subscribe(res => {
          // console.log(res);
          this.reviewList = res.list;
          this.reviewList.forEach(item => {
            this.reviewId = item.id;
          });
        });
      }
    }
  }
  modeChange() {
    this.fetchPublicities(this.selectedIndex);
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.fetchPublicities(this.selectedIndex);
  }
  // 意向选择
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.intention_id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.intention_id]) && !this.isAllDisplayDataChecked;
  }
  currentPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }
  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.intention_id] = value));
    this.refreshStatus();
  }
  // 一审
  firstRefreshStatus(): void {
    this.isFirstAllDisplayDataChecked = this.firstListOfDisplayData.every(item => this.firstMapOfCheckedId[item.id]);
    this.isFirstIndeterminate =
      this.firstListOfDisplayData.some(item => this.firstListOfDisplayData[item.id]) && !this.isFirstAllDisplayDataChecked;
    // console.log(this.firstMapOfCheckedId);

  }
  firstPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    // console.log($event);
    this.firstListOfDisplayData = $event;
    this.firstRefreshStatus();
  }
  firstCheckAll(value: boolean): void {
    this.firstListOfDisplayData.forEach(item => (this.firstMapOfCheckedId[item.id] = value));
    this.firstRefreshStatus();
  }
  // 二审
  secondRefreshStatus(): void {
    this.isSecondAllDisplayDataChecked = this.secondListOfDisplayData.every(item => this.secondMapOfCheckedId[item.id]);
    this.isSecondIndeterminate =
      this.secondListOfDisplayData.some(item => this.secondMapOfCheckedId[item.id]) && !this.isSecondAllDisplayDataChecked;
    // console.log(this.secondMapOfCheckedId);

  }
  secondPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.secondListOfDisplayData = $event;
    this.secondRefreshStatus();
  }
  secondCheckAll(value: boolean): void {
    this.secondListOfDisplayData.forEach(item => (this.secondMapOfCheckedId[item.id] = value));
    this.secondRefreshStatus();
  }
  // 三审
  threeRefreshStatus(): void {
    this.isThreeAllDisplayDataChecked = this.threeListOfDisplayData.every(item => this.threeMapOfCheckedId[item.id]);
    this.isThreeIndeterminate =
      this.threeListOfDisplayData.some(item => this.threeMapOfCheckedId[item.id]) && !this.isThreeAllDisplayDataChecked;
    // console.log(this.threeMapOfCheckedId);

  }
  threePageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.threeListOfDisplayData = $event;
    this.threeRefreshStatus();
  }
  threeCheckAll(value: boolean): void {
    this.threeListOfDisplayData.forEach(item => (this.threeMapOfCheckedId[item.id] = value));
    this.threeRefreshStatus();
  }
  publicityPlay(id: number, sid: number) {
    // console.log(id);
    this.router.navigate([`/manage/image/image-details/${id}`, { sid: sid }]);
  }
  // 发起审片弹框
  launchFilms() {
    this.checkedIntentionIds = [];
    this.intentonName = [];
    for (const key in this.mapOfCheckedId) {
      if (this.mapOfCheckedId[key]) {
        this.checkedIntentionIds.push(Number(key));
      }
    }
    this.intentionList.forEach(item => {
      this.checkedIntentionIds.forEach(ele => {
        if (item.intention_id === ele) {
          this.intentonName.push(item.name);
        }
      });
    });
    this.modalService.create({
      nzTitle: `您将提交：`,
      nzContent: LaunchFilmsComponent,
      nzComponentParams: { intentonName: this.intentonName },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 440,
      nzCancelText: '取消',
      nzNoAnimation: true,
      nzOkText: '确定',
      nzOnOk: () => new Promise((resolve) => {
        resolve();
        this.creatReview();
        // 重置数据
        for (const key in this.mapOfCheckedId) {
          if (this.mapOfCheckedId[key]) {
            this.mapOfCheckedId[key] = false;
          }
        }
        this.isAllDisplayDataChecked = false;
        this.selectedTabIndex = 1;
        this.selectedIndex = 1;
        this.fetchPublicities(this.selectedIndex);
      })
    });
  }
  creatReview() {
    this.service.creatReview(this.checkedIntentionIds).subscribe(res => {
      // console.log(res);
      // console.log(this.checkedIntentionIds);
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

  // 进入一审详情页
  firstCheck(id, sid) {
    this.router.navigate([`/manage/image/films-details/${id}`, { sid: sid }]);
  }
  // 节目名跳转详情
  AdministratorViewDetails(id, sid) {
    this.router.navigate([`/manage/image/admin-films-details/${id}`, { sid: sid }]);
  }
  // 设置面板改变
  onSelectChange(event) {
    this.selectedIndex = event.index;
    this.fetchPublicities(this.selectedIndex);
  }
  // 一审提交
  submitNext() {
    const review_ids = [];
    // const step_number = 1;
    for (const key in this.firstMapOfCheckedId) {
      if (this.firstMapOfCheckedId[key]) {
        review_ids.push(Number(key));
      }
    }
    this.service.submitFirstInstance(review_ids).subscribe(res => {
        this.message.success('提交审片成功');
    });
    this.selectedTabIndex = 2;
    this.selectedIndex = 2;
    this.fetchPublicities(this.selectedIndex);
  }
  // 二审提交
  secondSubmit() {
    const review_ids = [];
    // const step_number = 2;
    for (const key in this.secondMapOfCheckedId) {
      if (this.secondMapOfCheckedId[key]) {
        review_ids.push(Number(key));
      }
    }
    // this.review_ids = this.checkedFirstIds;
    // console.log(this.checkedFirstIds);
    this.service.submitFirstInstance(review_ids).subscribe(res => {
      // console.log(res);
    });
    this.selectedTabIndex = 3;
    this.selectedIndex = 3;
    this.fetchPublicities(this.selectedIndex);
  }
  // 三审提交(入库跳转)
  // goSave() {
  //   // this.router.navigate([`/manage/series/add-copyrights`]);
  //   const review_ids = [];
  //   // const step_number = 3;
  //   for (const key in this.threeMapOfCheckedId) {
  //     if (this.threeMapOfCheckedId[key]) {
  //       review_ids.push(Number(key));
  //     }
  //   }
  //   this.service.submitFirstInstance(review_ids).subscribe(res => {
  //     console.log(res);
  //   });
  // }

}
