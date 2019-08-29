import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SeriesService } from '../../series/series.service';
import { PaginationDto, Util } from '@shared';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { ACLAbility } from '@core/acl';
import { LaunchFilmsComponent } from '../components/launch-films/launch-films.component';
// import { CallUpComponent } from '../components/call-up/call-up.component';
import { fadeIn } from '@shared/animations';
import { SubmitFirstReviewComponent } from '../components/submit-first-review/submit-first-review.component';
import { SubmitSecondReviewComponent } from '../components/submit-second-review/submit-second-review.component';

@Component({
  selector: 'app-review-view',
  templateUrl: './review-view.component.html',
  styleUrls: ['./review-view.component.less'],
  animations: [fadeIn],
})
export class ReviewViewComponent implements OnInit {
  @ViewChild('publicityOk') publicityOk: any;

  readonly fileFilters = ['mp4', 'wmv', 'rmvb', 'mkv', 'mov', 'avi', 'mpg'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  plainFooter = 'plain extra footer';
  selectedValue = null;
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
  selectedTabIndex = 0;
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
  // selectedTabIndex = 0;
  isReviewView: boolean;
  screen: any;
  employeeName: any;
  companyName: any;
  selectedSortValue: any;
  receiverId = '';
  companyId = '';
  sortValue = '';
  starTime = '';
  endTime = '';
  isForm: number;
  isMyTapesLoaded = false;
  isShowTab = false;
  isShowView = false;
  reviewName = [];

  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: SeriesService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.isForm = +params.get('isForm');
      // console.log(this.isForm);
      if (this.isForm === 1) {
        for (const key in this.mapOfCheckedId) {
          if (this.mapOfCheckedId[key]) {
            this.mapOfCheckedId[key] = false;
          }
        }
        this.mode = 'table';
        this.isAllDisplayDataChecked = false;
        this.selectedTabIndex = 1;
        // this.selectedTabIndex = 1;
        this.fetchPublicities(this.selectedTabIndex);
        this.isMyTapesLoaded = true;
      }
    });
    this.service.getScreenList(this.selectedTabIndex).subscribe(res => {
      this.screen = res;
      // console.log(res);
    });
    this.service.getReviewView(this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isMyTapesLoaded = true;
      }))
      .subscribe(result => {
        this.list = result.list;
        this.pagination = result.pagination;
        this.isMyTapesLoaded = true;

        // console.log(this.list);
      });
    // console.log(this.intentionList.length);
  }
  fetchPublicities(step_number) {
    this.isLoading = true;
    if (this.mode === 'figure') {
      this.service.getReviewView(this.pagination)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.isMyTapesLoaded = true;
        }))
        .subscribe(result => {
          this.list = result.list;
          this.pagination = result.pagination;
          this.isMyTapesLoaded = true;
          // console.log(this.list);
        });
    } else if (this.mode === 'table') {
      if (step_number === 0) {
        this.getAllIntentionList();
      } else {
        this.getAllReviewList();
      }
    }
  }
  getAllIntentionList() {
    this.service.getIntentionTypeList(this.pagination, this.companyId, this.receiverId)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isMyTapesLoaded = true;
        this.isShowTab = true;
        this.isShowView = true;
      }))
      .subscribe(result => {
        this.intentionList = result.list;
        this.pagination = result.pagination;
        this.isMyTapesLoaded = true;
        this.isShowTab = true;
        this.isShowView = true;
        // this.paginationName = result.pagination.name;
      });
  }
  getAllReviewList() {
    this.service.getReviewList(this.pagination, this.selectedTabIndex, this.companyId,
      this.receiverId, this.sortValue, this.starTime, this.endTime).subscribe(res => {
        // console.log(res);
        this.reviewList = res.list;
        // console.log(this.reviewList, 'eeee');
        this.isShowTab = true;
        this.isShowView = true;
        // console.log(this.reviewList);
        this.reviewList.forEach(item => {
          // console.log(item, '111');
          this.reviewId = item.id;
          // console.log(this.reviewId);
        });
      });
  }
  modeChange() {
    this.pagination.page = 1;
    this.fetchPublicities(this.selectedTabIndex);
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.fetchPublicities(this.selectedTabIndex);
  }
  // 意向选择
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    // console.log(this.mapOfCheckedId);
    // console.log(this.isAllDisplayDataChecked);
    // console.log(this.listOfDisplayData);
  }
  currentPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }
  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  // 一审
  firstRefreshStatus(): void {
    this.isFirstAllDisplayDataChecked = this.firstListOfDisplayData.every(item => this.firstMapOfCheckedId[item.id]);
    this.isFirstIndeterminate =
      this.firstListOfDisplayData.some(item => this.firstListOfDisplayData[item.id]) && !this.isFirstAllDisplayDataChecked;
    // console.log(this.firstMapOfCheckedId);
    // console.log(this.firstListOfDisplayData);
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
    // console.log(this.isSecondAllDisplayDataChecked);
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
    this.isThreeAllDisplayDataChecked = this.threeListOfDisplayData.every(item => this.threeMapOfCheckedId[item.publicity.program.id]);
    this.threeListOfDisplayData.every(item => this.isThreeAllDisplayDataChecked[item.publicity.program.id]);
    this.isThreeIndeterminate =
      this.threeListOfDisplayData.some(item => this.threeMapOfCheckedId[item.publicity.program.id]) && !this.isThreeAllDisplayDataChecked;
    // console.log(this.threeMapOfCheckedId, 'zzzz');
    // console.log(this.isThreeAllDisplayDataChecked);
    // console.log(this.threeListOfDisplayData, 'yyyyy');
    // console.log(this.threeMapOfCheckedId);
  }
  threePageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.threeListOfDisplayData = $event;
    this.threeRefreshStatus();
  }
  threeCheckAll(value: boolean): void {
    this.threeListOfDisplayData.forEach(item => (this.threeMapOfCheckedId[item.publicity.program.id] = value));
    this.threeRefreshStatus();
  }
  publicityPlay(sid: number, id: number) {
    // console.log(sid);g
    // console.log(id);
    this.router.navigate([`/manage/image/image-details/${id}`, { sid: sid, isHidden: 1, isSharing: 1 }]);
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
        if (item.id === ele) {
          this.intentonName.push(item.publicity.program.name);
        }
      });
    });
    if (this.checkedIntentionIds.length === 0) {
      this.message.error('请选择样片');
    } else {
      this.service.sendView().subscribe(res => {
        // console.log(res);
        this.modalService.create({
          nzTitle: `您将提交：`,
          nzContent: LaunchFilmsComponent,
          nzComponentParams: { intentonName: this.intentonName },
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
            // this.selectedTabIndex = 1;
            this.fetchPublicities(this.selectedTabIndex);
          })
        });
      }, error => {
        this.message.error('请配置审片设置');
      });
    }
  }
  creatReview() {
    this.service.creatReview(this.checkedIntentionIds).subscribe(res => {
      // console.log(res);
      // console.log(this.checkedIntentionIds);
    });
  }
  // 进入一审详情页
  firstCheck(sid, id, rid) {
    this.router.navigate([`/manage/image/films-details/${id}`, { sid: sid, rid: rid }]);
  }
  // 节目名跳转详情
  AdministratorViewDetails(sid: number, id: number, rid: number) {
    this.router.navigate([`/manage/image/admin-films-details/${id}`, { sid: sid, rid: rid }]);
  }
  // 设置面板改变
  onSelectChange(event) {
    this.isFirstAllDisplayDataChecked = false;
    this.isSecondAllDisplayDataChecked = false;
    this.isThreeAllDisplayDataChecked = false;
    this.selectedTabIndex = event.index;
    this.companyName = null;
    this.employeeName = null;
    this.selectedSortValue = null;
    this.companyId = '';
    this.sortValue = '';
    this.receiverId = '';
    this.starTime = '';
    this.endTime = '';
    this.reviewList = [];
    this.isShowTab = false;
    this.isMyTapesLoaded = true;
    this.fetchPublicities(this.selectedTabIndex);
    this.service.getScreenList(this.selectedTabIndex).subscribe(res => {
      this.screen = res;
      // console.log(res);
    });
    // console.log(this.selectedTabIndex);
  }
  // 一审提交
  submitNext() {
    const review_ids = [];
    this.intentonName = [];
    // const step_number = 1;
    for (const key in this.firstMapOfCheckedId) {
      if (this.firstMapOfCheckedId[key]) {
        review_ids.push(Number(key));
      }
    }
    this.reviewList.forEach(item => {
      // console.log(this.intentionList);
      review_ids.forEach(ele => {
        if (item.id === ele) {
          this.intentonName.push(item.publicity.program.name);
        }
      });
    });
    if (!review_ids.length) {
      this.message.error('请选择样片');
    } else {
      this.service.submitFirstInstance(review_ids).subscribe(res => {
        this.reviewName = res;
        // console.log(res);
        this.modalService.create({
          nzTitle: `以下所选节目将进入二审：`,
          nzContent: SubmitFirstReviewComponent,
          nzComponentParams: { intentonName: this.intentonName, reviewName: this.reviewName },
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: 440,
          nzCancelText: '取消',
          nzNoAnimation: true,
          nzOkText: '确定并通知',
          nzOnOk: () => new Promise((resolve) => {
            resolve();
            // 重置数据
            for (const key in this.firstMapOfCheckedId) {
              if (this.firstMapOfCheckedId[key]) {
                this.firstMapOfCheckedId[key] = false;
              }
            }
            this.isAllDisplayDataChecked = false;
            this.selectedTabIndex = 2;
            this.fetchPublicities(this.selectedTabIndex);
            this.message.success('提交审片成功');
            const employee_ids = [];
            this.reviewName.forEach(item => {
              employee_ids.push(item.id);
              // console.log(employee_ids);
            });
            // tslint:disable-next-line:no-shadowed-variable
            this.service.reviewNotice(employee_ids).subscribe(res => {
              // console.log(res);
            });
          })
        });
      });

    }
  }
  // 二审提交
  secondSubmit() {
    const review_ids = [];
    this.intentonName = [];
    // const step_number = 2;
    for (const key in this.secondMapOfCheckedId) {
      if (this.secondMapOfCheckedId[key]) {
        review_ids.push(Number(key));
      }
    }
    // this.review_ids = this.checkedFirstIds;
    // console.log(this.checkedFirstIds);
    this.reviewList.forEach(item => {
      review_ids.forEach(ele => {
        if (item.id === ele) {
          this.intentonName.push(item.publicity.program.name);
        }
      });
    });
    if (!review_ids.length) {
      this.message.error('请选择样片');
    } else {
      this.service.submitFirstInstance(review_ids).subscribe(res => {
        // console.log(res);
        this.reviewName = res;
        this.modalService.create({
          nzTitle: `以下所选节目将进入三审`,
          nzContent: SubmitSecondReviewComponent,
          nzComponentParams: { intentonName: this.intentonName, reviewName: this.reviewName },
          nzClosable: false,
          nzNoAnimation: true,
          nzWidth: 440,
          nzCancelText: '取消',
          nzOkText: '确定',
          nzOnOk: () => new Promise((resolve) => {
            resolve();
            // this.creatReview();
            // 重置数据
            for (const key in this.threeMapOfCheckedId) {
              if (this.threeMapOfCheckedId[key]) {
                this.threeMapOfCheckedId[key] = false;
              }
            }
            this.isAllDisplayDataChecked = false;
            this.selectedTabIndex = 3;
            this.fetchPublicities(this.selectedTabIndex);
            const employee_ids = [];
            this.reviewName.forEach(item => {
              employee_ids.push(item.id);
              // console.log(employee_ids);
            });
            // tslint:disable-next-line:no-shadowed-variable
            this.service.reviewNotice(employee_ids).subscribe(res => {
              // console.log(res);
            });
          })
        });
      });
    }
  }
  // 三审提交(入库跳转)
  goSave() {
    const review_ids = [];
    // const step_number = 3;
    for (const key in this.threeMapOfCheckedId) {
      if (this.threeMapOfCheckedId[key]) {
        review_ids.push(Number(key));
      }
    }
    const reviewId = [];
    this.threeListOfDisplayData.forEach(item => {
      if (review_ids.indexOf(item.publicity.program.id) > -1) {
        reviewId.push(item.id);
        // console.log(reviewId, '2222');
      }
    });
    if (review_ids.length === 0) {
      this.message.error('请选择样片');
    } else {
      this.router.navigate([`/manage/series/add-copyrights`, { pids: review_ids, ids: reviewId, isVerify: 1 }]);
    }
  }
  firstReviewGoSave() {
    const review_ids = [];
    // const step_number = 3;
    for (const key in this.firstMapOfCheckedId) {
      if (this.firstMapOfCheckedId[key]) {
        review_ids.push(Number(key));
      }
    }
    const reviewId = [];
    this.firstListOfDisplayData.forEach(item => {
      if (review_ids.indexOf(item.id) > -1) {
        reviewId.push(item.publicity.program.id);
      }
    });
    if (review_ids.length === 0) {
      this.message.error('请选择样片');
    } else {
      this.router.navigate([`/manage/series/add-copyrights`, { pids: reviewId, ids: review_ids, isVerify: 1 }]);
    }
  }
  secondReviewGoSave () {
    const review_ids = [];
    // const step_number = 3;
    for (const key in this.secondMapOfCheckedId) {
      if (this.secondMapOfCheckedId[key]) {
        review_ids.push(Number(key));
      }
    }
    const reviewId = [];
    this.secondListOfDisplayData.forEach(item => {
      if (review_ids.indexOf(item.id) > -1) {
        reviewId.push(item.publicity.program.id);
      }
    });
    if (review_ids.length === 0) {
      this.message.error('请选择样片');
    } else {
      this.router.navigate([`/manage/series/add-copyrights`, { pids: reviewId, ids: review_ids, isVerify: 1 }]);
    }
  }
  // 审片筛选功能
  getCompanyName(data) {
    this.companyName = data;
    if (this.companyName === null) {
      this.companyId = '';
    } else {
      this.screen.company_choices.forEach(item => {
        if (this.companyName === item.full_name) {
          this.companyId = item.id;
        }
      });
    }
    this.getAllReviewList();
  }
  getEmployeeName(data) {
    this.employeeName = data;
    if (this.employeeName === null) {
      this.receiverId = '';
    } else {
      this.screen.employee_choices.forEach(item => {
        if (this.employeeName === item.name) {
          this.receiverId = item.id;
        }
      });
    }
    this.getAllReviewList();
  }
  getSort(data) {
    this.sortValue = data;
    if (this.sortValue === null) {
      this.sortValue = '';
    }
    this.getAllReviewList();
  }
  getViewTime(data) {
    this.starTime = Util.dateToString(data[0]);
    this.endTime = Util.dateToString(data[1]);
    if (this.starTime === null || this.endTime === null) {
      this.starTime = '';
      this.endTime = '';
    }
    this.getAllReviewList();

  }
  // 意向筛选功能
  getIntentionCompanyName(data) {
    this.companyName = data;
    if (this.companyName === null) {
      this.companyId = '';
    } else {
      this.screen.company_choices.forEach(item => {
        if (this.companyName === item.full_name) {
          this.companyId = item.id;
        }
      });
    }
    this.getAllIntentionList();
  }
  getIntentionEmployeeName(data) {
    this.employeeName = data;
    if (this.employeeName === null) {
      this.receiverId = '';
    } else {
      this.screen.employee_choices.forEach(item => {
        if (this.employeeName === item.name) {
          this.receiverId = item.id;
        }
      });
    }
    this.getAllIntentionList();
  }
  // 删除审片
}

