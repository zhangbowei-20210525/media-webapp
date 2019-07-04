
import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SeriesService } from '../../series/series.service';
import { switchMap, tap, map } from 'rxjs/operators';
import { PaginationDto, MessageService } from '@shared';
import { I18nService } from '@core';
import { TendencyInfoComponent } from '../components/tendency-info/tendency-info.component';
import { NzModalRef, NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { FirstInstanceDetailsComponent } from '../components/first-instance-details/first-instance-details.component';
// import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

declare function videojs(selector: string);

@Component({
  selector: 'app-admin-films-details',
  templateUrl: './admin-films-details.component.html',
  styleUrls: ['./admin-films-details.component.less']
})
export class AdminFilmsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  id: number;
  player: any;
  pdfPage: number;
  twoDimensionalCode: any;

  sampleName: string;
  sampleSrc: string;
  samplePoster: string;
  sampleNum = [];
  sampleIndex: number;


  featureName: string;
  featureSrc: string;
  featurePoster: string;
  featureNum = [];
  featureIndex: number;

  trailerName: string;
  trailerSrc: string;
  trailerPoster: string;
  trailerNum = [];
  trailerIndex: number;

  posterName: string;
  posterSrc: string;
  posterNum = [];
  posterIndex: number;

  stillName: string;
  stillSrc: string;
  stillNum = [];
  stillIndex: number;

  pdfName: string;
  pdfSrc: string;
  pdfNum = [];
  pdfIndex: number;

  publicityName: string;
  samplePagination: PaginationDto;
  featurePagination: PaginationDto;
  trailerPagination: PaginationDto;
  posterPagination: PaginationDto;
  stillPagination: PaginationDto;
  pdfPagination: PaginationDto;
  sampleList = [];
  featureList = [];
  trailerList = [];
  posterList = [];
  stillList = [];
  pdfList = [];
  ishidden: boolean;
  publicityType: string;
  userinfo: any;
  sid: number;
  seriesInfo: any;
  sampleDisabled: boolean;
  featureDisabled: boolean;
  trailerDisabled: boolean;
  posterDisabled: boolean;
  stillDisabled: boolean;
  pdfDisabled: boolean;
  languageVersion: string;
  emailAddress: string;
  tabIndex: number;
  fixationInfo: any; // 可能是用户信息
  firstVerify: boolean;
  secondVerify: boolean;
  threeVerify: boolean;
  firstComment = '';
  secondComment = '';
  threeComment = '';
  starArray = [];
  firstObj = {};
  secondObj = {};
  threeObj = {};
  fourObj = {};
  fiveObj = {};
  step_number = 0;
  selectedIndex = 0;
  reviewRecodesStatistic: any;
  reviewRecords: any;
  reviewFirstSteps: any;
  reviewSecondSteps = {};
  reviewThirdSteps = {};
  firstLike = 0;
  firstOppose = 0;
  // reviewSteps = [];
  secondAvg: any;
  thirdAvg: any;
  stepsNumber: any;
  likePeople: any;
  disLikePeople: any;
  secondLikePeople: any;
  secondDisLikePeople: any;
  secondLike: number;
  secondOppose: number;
  thirdDisLikePeople: any;
  thirdLike: number;
  thirdOppose: number;
  reviewList: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService,
    private modalService: NzModalService,
    private i18n: I18nService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.ishidden = false;
    this.samplePagination = { page: 1, count: 10, page_size: 10000 } as PaginationDto;
    this.featurePagination = { page: 1, count: 10, page_size: 10000 } as PaginationDto;
    this.trailerPagination = { page: 1, count: 10, page_size: 10000 } as PaginationDto;
    this.posterPagination = { page: 1, count: 10, page_size: 10000 } as PaginationDto;
    this.stillPagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
    this.pdfPagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('id');
        this.sid = +params.get('sid');
        this.tabIndex = +params.get('tabIndex');
        this.sampleIndex = +params.get('sampleIndex');
        this.featureIndex = +params.get('featureIndex');
        this.trailerIndex = +params.get('trailerIndex');
        this.posterIndex = +params.get('posterIndex');
        this.stillIndex = +params.get('stillIndex');
        this.pdfIndex = +params.get('pdfIndex');
        return this.seriesService.pubDetail(this.sid);
      })).subscribe(res => {
        // console.log(res);
        this.seriesService.getUserinfo(this.sid).subscribe(cpd => {
          this.userinfo = cpd;
          if (this.userinfo.material.sample === 0) {
            this.sampleDisabled = true;
          }
          if (this.userinfo.material.feature === 0) {
            this.featureDisabled = true;
          }
          if (this.userinfo.material.trailer === 0) {
            this.trailerDisabled = true;
          }
          if (this.userinfo.material.poster === 0) {
            this.posterDisabled = true;
          }
          if (this.userinfo.material.still === 0) {
            this.stillDisabled = true;
          }
          if (this.userinfo.material.pdf === 0) {
            this.pdfDisabled = true;
          }
        });
        this.seriesService.getDetailsInfo(this.sid).subscribe(cpd => {
          // console.log(cpd);
          this.seriesInfo = cpd;
        });
        this.publicityName = res.name;
        if (!this.publicityType || this.publicityType === 'sample') {
          this.publicityType = 'sample';
          this.getSampleInfo();
        }
        if (this.publicityType === 'feature') {
          this.getFeatureInfo();
        }
        if (this.publicityType === 'trailer') {
          this.getTrailerInfo();
        }
        if (this.publicityType === 'poster') {
          this.getPosterInfo();
        }
        if (this.publicityType === 'still') {
          this.getStillInfo();
        }
        if (this.publicityType === 'pdf') {
          this.getPdfInfo();
        }
      });
    this.getVerifyData(this.step_number);
    this.seriesService.getReviewDetails(this.id).subscribe(res => {
      console.log('23423423423423424');
      console.log(res);
      this.reviewList = res;
      this.reviewFirstSteps = res.review_steps[0];
      // 一审喜欢人数及通过率
      this.likePeople = res.review_steps[0].review_records_statistic.conclusion_statistic.agree;
      this.disLikePeople = res.review_steps[0].review_records_statistic.conclusion_statistic.oppose;
      this.firstLike = (res.review_steps[0].review_records_statistic.conclusion_statistic.agree /
      res.review_steps[0].review_records_statistic.reviewed_count) * 100;
      this.firstOppose = (res.review_steps[0].review_records_statistic.conclusion_statistic.oppose /
      res.review_steps[0].review_records_statistic.reviewed_count) * 100;
      // 二审喜欢人数及通过率

      this.secondLikePeople = res.review_steps[1].review_records_statistic.conclusion_statistic.agree;
      this.secondDisLikePeople = res.review_steps[1].review_records_statistic.conclusion_statistic.oppose;
      this.secondLike = (res.review_steps[1].review_records_statistic.conclusion_statistic.agree /
      res.review_steps[1].review_records_statistic.reviewed_count) * 100;
      this.secondOppose = (res.review_steps[1].review_records_statistic.conclusion_statistic.oppose /
      res.review_steps[1].review_records_statistic.reviewed_count) * 100;
      // 三审喜欢人数及通过率
      this.disLikePeople = res.review_steps[2].review_records_statistic.conclusion_statistic.agree;
      this.thirdDisLikePeople = res.review_steps[2].review_records_statistic.conclusion_statistic.oppose;
      this.thirdLike = (res.review_steps[2].review_records_statistic.conclusion_statistic.agree /
      res.review_steps[2].review_records_statistic.reviewed_count) * 100;
      this.thirdOppose = (res.review_steps[2].review_records_statistic.conclusion_statistic.oppose /
      res.review_steps[2].review_records_statistic.reviewed_count) * 100;
      // 总分
      this.reviewSecondSteps = res.review_steps[1];
      this.reviewThirdSteps = res.review_steps[2];
      console.log(res);
      this.secondAvg = res.review_steps[1].review_records_statistic.score_statistic.avg;
      this.thirdAvg = res.review_steps[2].review_records_statistic.score_statistic.avg;
      this.stepsNumber = res.step_number;
      // this.stepsNumber = 3;
    });
  }
  getVerifyData(step_number) {
    //   this.seriesService.getFirstVerifyData().subscribe(res=>{
    //     console.log(res);
  }
  ngAfterViewInit() {
    this.player = videojs('#video_player');
    this.player.width(800);
    this.player.height(470);
    this.player.load();
  }

  nomenu(event) {
    event.preventDefault();
  }

  ngOnDestroy() {
    this.player.dispose();
  }

  playerSource(src: string, poster?: string) {
    this.player.pause();
    if (poster) {
      this.player.poster(poster);
    }
    // this.player.src('http://media.html5media.info/video.mp4');
    this.player.src(src);
    this.player.load();
  }

  getSampleInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.samplePagination, this.sid, 'sample').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.sampleList = s.list;
      this.samplePagination = s.pagination;
      if (this.sampleList.length > 0) {
        this.sampleName = this.sampleList[this.sampleIndex].name;
        this.sampleSrc = this.sampleList[this.sampleIndex].src;
        this.samplePoster = this.sampleList[this.sampleIndex].poster;
        this.samplePageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.sampleSrc, this.samplePoster);
        // this.playerSource('http://test.static.bctop.net/马术-24/马术-hls/playlist.m3u8', this.samplePoster);
      }
    });
  }

  getFeatureInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.featurePagination, this.sid, 'feature').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.featureList = s.list;
      this.featurePagination = s.pagination;
      if (this.featureList.length > 0) {
        this.featureName = this.featureList[this.featureIndex].name;
        this.featureSrc = this.featureList[this.featureIndex].src;
        this.featurePoster = this.featureList[this.featureIndex].poster;
        this.featurePageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.featureSrc, this.featurePoster);
      }
    });
  }

  getTrailerInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.trailerPagination, this.sid, 'trailer').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.trailerList = s.list;
      this.trailerPagination = s.pagination;
      if (this.trailerList.length > 0) {
        this.trailerName = this.trailerList[this.trailerIndex].name;
        this.trailerSrc = this.trailerList[this.trailerIndex].src;
        this.trailerPoster = this.trailerList[this.trailerIndex].poster;
        this.trailerPageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.trailerSrc, this.trailerPoster);
      }
    });
  }

  getPosterInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.posterPagination, this.sid, 'poster').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.posterList = s.list;
      this.trailerPagination = s.pagination;
      if (this.posterList.length > 0) {
        this.posterName = this.posterList[this.posterIndex].name;
        this.posterSrc = this.posterList[this.posterIndex].src;
        this.posterPageChange({ page: 1, pageSize: 20 });
      }
    });
  }

  getStillInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.stillPagination, this.sid, 'still').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.stillList = s.list;
      this.stillPagination = s.pagination;
      if (this.stillList.length > 0) {
        this.stillName = this.stillList[this.stillIndex].name;
        this.stillSrc = this.stillList[this.stillIndex].src;
        this.stillPageChange({ page: 1, pageSize: 20 });
      }
    });
  }

  getPdfInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.pdfPagination, this.sid, 'pdf').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.pdfList = s.list;
      this.pdfPagination = s.pagination;
      if (this.pdfList.length > 0) {
        this.pdfName = this.pdfList[this.pdfIndex].name;
        this.pdfSrc = this.pdfList[this.pdfIndex].src;
        // this.pdfSrc = 'http://192.168.1.109:8000/media_files/720fa654-3d79-11e9-91a9-685b35a5b556.pdf';
        this.pdfPage = 1;
        this.pdfPageChange({ page: 1, pageSize: 20 });
      }
    });
  }

  samplePageChange(pageData) {
    const list = this.sampleList;
    this.sampleNum = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  }

  featurePageChange(pageData) {
    const list = this.featureList;
    this.featureNum = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  }

  trailerPageChange(pageData) {
    const list = this.trailerList;
    this.trailerNum = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  }

  posterPageChange(pageData) {
    const list = this.posterList;
    this.trailerNum = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  }

  stillPageChange(pageData) {
    const list = this.stillList;
    this.stillNum = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  }

  pdfPageChange(pageData) {
    const list = this.pdfList;
    this.pdfNum = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  }



  lastPoster() {
    if (this.posterIndex > 0) {
      this.posterIndex = this.posterIndex - 1;
      this.posterName = this.posterList[this.posterIndex].name;
      this.posterSrc = this.posterList[this.posterIndex].src;
    } else { }
  }

  nextPoster() {
    if (this.posterIndex + 1 < this.posterList.length) {
      this.posterIndex = this.posterIndex + 1;
      this.posterSrc = this.posterList[this.posterIndex].src;
      this.posterName = this.posterList[this.posterIndex].name;
    } else { }
  }

  lastStill() {
    if (this.stillIndex > 0) {
      this.stillIndex = this.stillIndex - 1;
      this.stillName = this.stillList[this.stillIndex].name;
      this.stillSrc = this.stillList[this.stillIndex].src;
    } else { }
  }

  nextStill() {
    if (this.stillIndex + 1 < this.stillList.length) {
      this.stillIndex = this.stillIndex + 1;
      this.stillSrc = this.stillList[this.stillIndex].src;
      this.stillName = this.stillList[this.stillIndex].name;
    } else { }
  }

  lastPdf() {
    if (this.pdfPage > 0) {
      this.pdfPage = this.pdfPage - 1;
    } else { }
  }

  nextPdf() {
    this.pdfPage = this.pdfPage + 1;
  }



  sampleNavigateToDetail(i: number, id: number) {
    this.sampleIndex = i - 1;
    this.publicityType = 'sample';
    this.router.navigate([`/manage/image/image-details/${this.id}`,
    { sampleIndex: this.sampleIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  featureNavigateToDetail(i: number, id: number) {
    this.featureIndex = i - 1;
    this.publicityType = 'feature';
    this.router.navigate([`/manage/image/image-details/${this.id}`,
    { featureIndex: this.featureIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  trailerNavigateToDetail(i: number, id: number) {
    this.trailerIndex = i - 1;
    this.publicityType = 'trailer';
    this.router.navigate([`/manage/image/image-details/${this.id}`,
    { trailerIndex: this.trailerIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  posterNavigateToDetail(i: number) {
    this.posterIndex = i;
    this.publicityType = 'poster';
    this.router.navigate([`/manage/image/image-details/${this.id}`,
    { posterIndex: this.posterIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  stillNavigateToDetail(i: number) {
    this.stillIndex = i;
    this.publicityType = 'still';
    this.router.navigate([`/manage/image/image-details/${this.id}`,
    { stillIndex: this.stillIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  pdfNavigateToDetail(i: number) {
    this.pdfIndex = i;
    this.publicityType = 'pdf';
    this.router.navigate([`/manage/image/image-details/${this.id}`,
    { pdfIndex: this.pdfIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }
  sample() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'sample';
    this.getSampleInfo();
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { sampleIndex: this.sampleIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  feature() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'feature';
    this.getFeatureInfo();
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { featureIndex: this.featureIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  trailer() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'trailer';
    this.getTrailerInfo();
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { trailerIndex: this.trailerIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  poster() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'poster';
    this.getPosterInfo();
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { posterIndex: this.posterIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }
  still() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'still';
    this.getStillInfo();
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { stillIndex: this.stillIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  pdf() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'pdf';
    this.getPdfInfo();
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { pdfIndex: this.pdfIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  getTwoDimensionalCode() {
    // zh-CN en-US
    this.languageVersion = this.i18n.currentLang;
    if (this.languageVersion === 'zh-CN') {
      this.seriesService.getTwoDimensionalCode(this.id)
        .pipe(map(x => x = `data:image/png;base64,${x}`))
        .subscribe(res => {
          this.twoDimensionalCode = res;
        });
    }
    if (this.languageVersion === 'en-US') {
    }

  }

  tabSelectChange(event) {
    console.log(event.index);
    this.step_number = event.index;
  }
  verifySelectChange(event) {
    this.selectedIndex = event.index;
  }

  shareEmail() {
    // console.log(this.tabIndex);
    // tslint:disable-next-line:max-line-length
    this.seriesService.shareEmail(this.emailAddress, `http://test1.bctop.net/d/${this.id}`, this.publicityName, this.sid).subscribe();
  }

  // 选择偏向弹框
  choseTendency() {
    this.modalService.create({
      nzTitle: `发起审片`,
      nzContent: TendencyInfoComponent,
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

  // 选择是否喜欢
  choseIsLike(data) {
    if (data === 'like') {
      this.firstVerify = true;
    } else {
      this.firstVerify = false;
    }
    console.log(data);
  }
  // 文本框
  textareaValue(data) {
    this.firstComment = data;
  }
  // 提交一审详情
  // submit() {
  //   this.modalService.create({
  //     nzTitle: `提交信息`,
  //     nzContent: FirstInstanceDetailsComponent,
  //     // nzComponentParams: { id: this.publicityId },
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: 400,
  //     nzOkText: '确定',
  //     nzCancelText: '取消',
  //     nzNoAnimation: true,
  //     nzOnOk: () => new Promise((resolve) => {
  //       resolve();
  //       // const obj = {
  //       //   conclusion: this.firstVerify,
  //       //   comment: this.firstComment,
  //       // };
  //       const conclusion = this.firstVerify;
  //       const comment = this.firstComment;
  //       const scoring = [];
  //       if (JSON.stringify(this.firstObj) !== '{}') {
  //         scoring.push(this.firstObj);
  //       }
  //       if (JSON.stringify(this.secondObj) !== '{}') {
  //         scoring.push(this.secondObj);
  //       }
  //       if (JSON.stringify(this.threeObj) !== '{}') {
  //         scoring.push(this.threeObj);
  //       }
  //       if (JSON.stringify(this.fourObj) !== '{}') {
  //         scoring.push(this.fourObj);
  //       }
  //       if (JSON.stringify(this.fiveObj) !== '{}') {
  //         scoring.push(this.fiveObj);
  //       }
  //       if (conclusion === undefined || comment === '') {
  //         this.message.error('请填写完整信息');
  //       } else {
  //         this.seriesService.submitFirstInstanceDetails(conclusion, scoring, comment, this.id).subscribe(res => {
  //           console.log(res);
  //         });
  //         this.message.success('审片成功');
  //         this.router.navigate([`manage/image`]);
  //       }
  //     }),
  //     // nzOnOk: (component: FirstInstanceDetailsComponent) => this.shareBusinessmen(component),
  //   });
  // }

  choseIsPass(data) {
    if (data === 'pass') {
      this.secondVerify = true;
    } else {
      this.secondVerify = false;
    }
    console.log(this.secondVerify);
    console.log(data);
  }
  // 文本框
  textareaValueSecond(data) {
    this.secondComment = data;
    console.log(data);
  }
  // 提交二审详情
  // submitSecond() {
  //   this.modalService.create({
  //     nzTitle: `提交信息`,
  //     nzContent: FirstInstanceDetailsComponent,
  //     // nzComponentParams: { id: this.publicityId },
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: 400,
  //     nzOkText: '确定',
  //     nzCancelText: '取消',
  //     nzNoAnimation: true,
  //     nzOnOk: () => new Promise((resolve) => {
  //       resolve();
  //       const conclusion = this.secondVerify;
  //       const comment = this.secondComment;
  //       const scoring = [];
  //       if (JSON.stringify(this.firstObj) !== '{}') {
  //         scoring.push(this.firstObj);
  //       }
  //       if (JSON.stringify(this.secondObj) !== '{}') {
  //         scoring.push(this.secondObj);
  //       }
  //       if (JSON.stringify(this.threeObj) !== '{}') {
  //         scoring.push(this.threeObj);
  //       }
  //       if (JSON.stringify(this.fourObj) !== '{}') {
  //         scoring.push(this.fourObj);
  //       }
  //       if (JSON.stringify(this.fiveObj) !== '{}') {
  //         scoring.push(this.fiveObj);
  //       }
  //       console.log(conclusion);
  //       console.log(comment);
  //       console.log(scoring);
  //       if (conclusion === undefined || comment === '') {
  //         this.message.error('请填写完整信息');
  //       } else {
  //         this.seriesService.submitSecondInstanceDetails(conclusion, scoring, comment, this.id).subscribe(res => {
  //           console.log(res);
  //         });
  //         this.router.navigate([`manage/image`]);
  //         this.message.success('审片成功');
  //       }
  //     }),
  //     // nzOnOk: (component: FirstInstanceDetailsComponent) => this.shareBusinessmen(component),
  //   });
  // }
  // 三审

  // choseIsPassThird(data) {
  //   if (data === 'threePass') {
  //     this.threeVerify = true;
  //   } else {
  //     this.threeVerify = false;
  //   }
  //   console.log(data);
  // }
  textareaValueThird(data) {
    this.threeComment = data;
    console.log(data);
  }
  // 提交三审详情
  submitThird() {
    this.modalService.create({
      nzTitle: `提交信息`,
      nzContent: FirstInstanceDetailsComponent,
      // nzComponentParams: { id: this.publicityId },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 400,
      nzOkText: '确定',
      nzCancelText: '取消',
      nzNoAnimation: true,
      nzOnOk: () => new Promise((resolve) => {
        resolve();
      }),
    });
  }
}
