
import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SeriesService } from '../../series/series.service';
import { switchMap, tap, map, finalize, } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { PaginationDto, MessageService, Util } from '@shared';
import { I18nService } from '@core';
import { TendencyInfoComponent } from '../components/tendency-info/tendency-info.component';
import { NzModalRef, NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { FirstInstanceDetailsComponent } from '../components/first-instance-details/first-instance-details.component';
// import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { Pipe, PipeTransform } from '@angular/core';
import { element } from '@angular/core/src/render3';

declare function videojs(selector: string);
// @HostListener('window:scroll', ['$event']) public onscroll = $event => {
//   console.log(document.documentElement.scrollTop, 'lalalalalal');
// };
@Component({
  selector: 'app-admin-films-details',
  templateUrl: './admin-films-details.component.html',
  styleUrls: ['./admin-films-details.component.less']
})
export class AdminFilmsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  mouth: any;
  @ViewChild('scrollFirstWrapper') elementFristView: ElementRef;
  @ViewChild('scrollSecondWrapper') elementSecondView: ElementRef;
  @ViewChild('scrollThirdWrapper') elementThirdView: ElementRef;
  @ViewChild('verifyFirstWrapper') verifyFirstView: ElementRef;
  @ViewChild('verifySecondWrapper') verifySecondView: ElementRef;
  @ViewChild('verifyThirdWrapper') verifyThirdView: ElementRef;
  @ViewChild('scoreFirstWrapper') scoreFirstView: ElementRef;
  @ViewChild('scoreSecondWrapper') scoreSecondView: ElementRef;
  @ViewChild('scoreThirdWrapper') scoreThirdView: ElementRef;
  @ViewChild('mainWrapper') mainElement: ElementRef;

  viewHeight: any;
  windowHeight: number;
  scrollHeight: any;
  isFixed = false;
  reviewFirstAdopt: any;
  reviewFirstLikeAdopt: number;
  reviewSecondAdopt: any;
  reviewSecondLikeAdopt: number;
  reviewThirdAdopt: any;
  reviewThirdLikeAdopt: number;
  publicityId: any;
  totalHeight = 0;
  verifyHeight: any;
  scoreHeight: any;
  fixedData: any;
  material_id: number;
  status: any;
  mainHeight: any;
  firstTrajectory: any;
  scoreOneList: any;
  oneScore: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService,
    private modalService: NzModalService,
    private i18n: I18nService,
    private message: MessageService,
  ) { }

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

  fixationInfo: any;
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
  reviewSecondSteps: any;
  reviewThirdSteps: any;
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
  rid: number;
  firstInformation: any;
  thirdLikePeople: any;

  scoreFirstList = [];
  nameFirstList = [];
  nameSecondList = [];
  scoreSecondList = [];
  scoreThirdList = [];
  nameThirdList = [];

  isLoading: boolean;
  isShowSelect = false;
  // 获取当前时间
  myDate = new Date();
  currentIndex = -1;
  isId: number;
  myVideo: any;
  startVideoTime: number;
  pauseVideoTime: number;
  realTimePlayback = 0;
  destroyTimers: any;

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
        this.rid = +params.get('rid');
        this.tabIndex = +params.get('tabIndex');
        this.sampleIndex = +params.get('sampleIndex');
        this.featureIndex = +params.get('featureIndex');
        this.trailerIndex = +params.get('trailerIndex');
        this.posterIndex = +params.get('posterIndex');
        this.stillIndex = +params.get('stillIndex');
        this.pdfIndex = +params.get('pdfIndex');
        return this.seriesService.publicityDetail(this.id);
      })).subscribe(res => {
        this.seriesService.getUserinfo(this.id).subscribe(cpd => {
          this.userinfo = cpd;
          if (this.tabIndex === 0) {
            const arr = [{ key: 0, num: this.userinfo.material.sample },
            { key: 1, num: this.userinfo.material.feature },
            { key: 2, num: this.userinfo.material.trailer },
            { key: 3, num: this.userinfo.material.poster },
            { key: 4, num: this.userinfo.material.still },
            { key: 5, num: this.userinfo.material.pdf }];
            const arr1 = [];
            arr.forEach(x => arr1.push(x.num));
            this.tabIndex = arr.filter(f => Math.max(...arr1) === f.num)[0].key;
          }
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
          if (this.tabIndex === 0) {
            this.publicityType = 'sample';
            this.sample();
          }
          if (this.tabIndex === 1) {
            this.publicityType = 'feature';
            this.feature();
          }
          if (this.tabIndex === 2) {
            this.publicityType = 'trailer';
            this.trailer();
          }
          if (this.tabIndex === 3) {
            this.publicityType = 'poster';
            this.poster();
          }
          if (this.tabIndex === 4) {
            this.publicityType = 'still';
            this.still();
          }
          if (this.tabIndex === 5) {
            this.publicityType = 'pdf';
            this.pdf();
          }
        });
        this.seriesService.getDetailsInfo(this.sid).subscribe(cpd => {
          this.seriesInfo = cpd;
        });
        this.publicityName = res.name;
        this.publicityId = res.id;
        if (this.publicityType === '' || this.publicityType === 'sample') {
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
    this.getReviewDetailsView();
    this.mainHeight = this.mainElement.nativeElement.offsetHeight;
    this.viewHeight = fromEvent(window, 'scroll')
      // debounceTime(500) // 防抖
      .subscribe((event) => {
        this.onWindowScroll();
      });
  }

  onWindowScroll() {
    // console.log('window');
    this.fixedData = [];
    this.windowHeight = document.documentElement.scrollTop;
    // 实时获取循环渲染的盒子高度
    if (this.windowHeight > 500) {
      if (this.selectedIndex === 0) {
        this.getWrapperHeight(this.reviewFirstSteps);
      } else if (this.selectedIndex === 1) {
        this.getWrapperHeight(this.reviewSecondSteps);
      } else {
        this.getWrapperHeight(this.reviewThirdSteps);
      }
    }
  }

  // 获取盒子的高度
  getWrapperHeight(reviewData) {
    if (this.selectedIndex === 0 && !!this.verifyFirstView.nativeElement && !!this.scoreFirstView.nativeElement) {
      this.verifyHeight = this.verifyFirstView.nativeElement.offsetHeight;
      this.scoreHeight = this.scoreFirstView.nativeElement.offsetHeight;
    } else if (this.selectedIndex === 1 && !!this.verifySecondView.nativeElement && !!this.scoreSecondView.nativeElement) {
      this.verifyHeight = this.verifySecondView.nativeElement.offsetHeight;
      this.scoreHeight = this.scoreSecondView.nativeElement.offsetHeight;
    } else {
      this.verifyHeight = this.verifyThirdView.nativeElement.offsetHeight;
      this.scoreHeight = this.scoreThirdView.nativeElement.offsetHeight;
    }
    const computedHeight = this.mainHeight + this.verifyHeight + this.scoreHeight + 315;
    reviewData.review_records.forEach((item, index) => {
      if (this.selectedIndex === 0) {
        item.wrapperHeight = this.elementFristView.nativeElement.querySelectorAll('.result-wrapper')[index].offsetHeight;
      } else if (this.selectedIndex === 1) {
        item.wrapperHeight = this.elementSecondView.nativeElement.querySelectorAll('.result-wrapper')[index].offsetHeight;
      } else {
        item.wrapperHeight = this.elementThirdView.nativeElement.querySelectorAll('.result-wrapper')[index].offsetHeight;
      }
      item.selectedNumber = index;
      item.isFixed = false;
    });
    for (let j = 0; j < reviewData.review_records.length; j++) {
      if (j === 0) {
        reviewData.review_records[0].totalHeight = computedHeight;
      } else {
        reviewData.review_records[j].totalHeight = reviewData.review_records[j - 1].totalHeight
          + reviewData.review_records[j - 1].wrapperHeight;
      }
    }
    this.fixedData = reviewData.review_records.filter(item => {
      return this.windowHeight > item.totalHeight;
    });
    // console.log(this.fixedData, 'fixData');
    if (this.fixedData.length > 1) {
      if (this.windowHeight > this.fixedData[this.fixedData.length - 1].totalHeight && this.windowHeight <
        this.fixedData[this.fixedData.length - 1].totalHeight + this.fixedData[this.fixedData.length - 1].wrapperHeight - 40) {
        reviewData.review_records[this.fixedData[this.fixedData.length - 1].selectedNumber].isFixed = true;
      } else {
        reviewData.review_records[this.fixedData[this.fixedData.length - 1].selectedNumber].isFixed = false;
      }
    } else {
      if (this.windowHeight > computedHeight && this.windowHeight <
        computedHeight + reviewData.review_records[0].wrapperHeight - 40) {
        reviewData.review_records[0].isFixed = true;
        // console.log(reviewData.review_records[0], 'eeee');
      } else {
        reviewData.review_records[0].isFixed = false;
      }
    }
  }

  getReviewDetailsView() {
    this.seriesService.getReviewDetails(this.rid)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(res => {
        // console.log(res);
        this.reviewList = res;
        // console.log(res.review_steps[0].review_records);
        this.firstTrajectory = res.review_steps[0].review_records;
        this.isLoading = true;
        // this.isShowFirstScore = res.review_steps[0].review_records_statistic
        // 一审评分项
        this.scoreFirstList = res.review_steps[0].review_records_statistic.score_statistic.item_statistic;
        this.nameFirstList = res.review_steps[0].scoring_items;
        this.nameFirstList.forEach((item, index) => {
          item.avg = (this.scoreFirstList[index].avg) / 2;
        });
        // 二审评分想
        this.scoreSecondList = res.review_steps[1].review_records_statistic.score_statistic.item_statistic;
        this.nameSecondList = res.review_steps[1].scoring_items;
        this.nameSecondList.forEach((item, index) => {
          item.avg = (this.scoreSecondList[index].avg) / 2;
        });
        // 三审评分想
        this.scoreThirdList = res.review_steps[2].review_records_statistic.score_statistic.item_statistic;
        this.nameThirdList = res.review_steps[2].scoring_items;
        this.nameThirdList.forEach((item, index) => {
          item.avg = (this.scoreThirdList[index].avg) / 2;
        });
        // 个人评分项
        // this.scoreOneList = res.review_steps[0].review_records.forEach(a => {
        //   a.scores.forEach( b => {
        //     b.score = b.score / 2;
        //     this.oneScore = b.scores;
        //   });
        // });
        // 查看更多功能注释
        // if (res.review_steps[0].lenght > 3) {
        // this.reviewFirstSteps = res.review_steps[0].splice(0, 3);
        // } else {
        this.reviewFirstSteps = res.review_steps[0];
        this.reviewFirstSteps.review_records.forEach(b => {
          b.total_score = b.total_score / 2;
         });
        // 添加展开下拉字段
        this.reviewFirstSteps.review_records.forEach(item => {
          item.isUp = false;
          item.scores.forEach(ele => {
            ele.score  = ele.score / 2;
          });
        });

        this.reviewSecondSteps = res.review_steps[1];
        this.reviewSecondSteps.review_records.forEach(b => {
          b.total_score = b.total_score / 2;
         });
        this.reviewSecondSteps.review_records.forEach(item => {
          item.isUp = false;
          item.scores.forEach(ele => {
            ele.score  = ele.score / 2;
          });
        });
        this.reviewThirdSteps = res.review_steps[2];
        this.reviewThirdSteps.review_records.forEach(b => {
          b.total_score = b.total_score / 2;
         });
        this.reviewThirdSteps.review_records.forEach(item => {
          item.isUp = false;
          item.scores.forEach(ele => {
            ele.score  = ele.score / 2;
          });
        });
        const currentYear = this.myDate.getFullYear();
        const currentMouth = this.myDate.getMonth() + 1;
        const currentDate = this.myDate.getDate();
        this.reviewFirstSteps.review_records.forEach(item => {
          const year = new Date(item.review_at).getFullYear();
          const mouth = new Date(item.review_at).getMonth() + 1;
          const date = new Date(item.review_at).getDate();
          if (year === currentYear) {
            if (mouth === currentMouth) {
              if (date === currentDate) {
                if (!!item.review_at) {
                  item.review_at = item.review_at.split(' ')[1];
                }
              }
            } else {
              item.review_at = item.review_at;
            }
          } else {
            if (!!item.review_at) {
              item.review_at = item.review_at.split(' ')[0];
            }
          }
        });
        this.reviewSecondSteps.review_records.forEach(item => {
          const year = new Date(item.review_at).getFullYear();
          const mouth = new Date(item.review_at).getMonth() + 1;
          const date = new Date(item.review_at).getDate();
          if (year === currentYear) {
            if (mouth === currentMouth) {
              if (date === currentDate) {
                if (!!item.review_at) {
                  item.review_at = item.review_at.split(' ')[1];
                }
              }
            } else {
              item.review_at = item.review_at;
            }
          } else {
            if (!!item.review_at) {
              item.review_at = item.review_at.split(' ')[0];
            }
          }
        });
        this.reviewThirdSteps.review_records.forEach(item => {
          const year = new Date(item.review_at).getFullYear();
          const mouth = new Date(item.review_at).getMonth() + 1;
          const date = new Date(item.review_at).getDate();
          if (year === currentYear) {
            if (mouth === currentMouth) {
              if (date === currentDate) {
                if (!!item.review_at) {
                  item.review_at = item.review_at.split(' ')[1];
                }
              }
            } else {
              item.review_at = item.review_at;
            }
          } else {
            if (!!item.review_at) {
              item.review_at = item.review_at.split(' ')[0];
            }
          }
        });
        // }
        // 一审喜欢人数及通过率
        this.likePeople = res.review_steps[0].review_records_statistic.conclusion_statistic.agree;
        this.disLikePeople = res.review_steps[0].review_records_statistic.conclusion_statistic.oppose;
        this.firstLike = ((res.review_steps[0].review_records_statistic.conclusion_statistic.agree /
          res.review_steps[0].review_records_statistic.count) * 100) || 0;
        this.firstOppose = ((res.review_steps[0].review_records_statistic.conclusion_statistic.oppose /
          res.review_steps[0].review_records_statistic.count) * 100) || 0;
        // 二审喜欢人数及通过率
        this.secondLikePeople = res.review_steps[1].review_records_statistic.conclusion_statistic.agree;
        this.secondDisLikePeople = res.review_steps[1].review_records_statistic.conclusion_statistic.oppose;
        this.secondLike = ((res.review_steps[1].review_records_statistic.conclusion_statistic.agree /
          res.review_steps[1].review_records_statistic.count) * 100) || 0;
        this.secondOppose = ((res.review_steps[1].review_records_statistic.conclusion_statistic.oppose /
          res.review_steps[1].review_records_statistic.count) * 100) || 0;

        // 三审喜欢人数及通过率
        this.thirdLikePeople = res.review_steps[2].review_records_statistic.conclusion_statistic.agree;
        this.thirdDisLikePeople = res.review_steps[2].review_records_statistic.conclusion_statistic.oppose;
        this.thirdLike = ((res.review_steps[2].review_records_statistic.conclusion_statistic.agree /
          res.review_steps[2].review_records_statistic.reviewed_count) * 100) || 0;
        this.thirdOppose = ((res.review_steps[2].review_records_statistic.conclusion_statistic.oppose /
          res.review_steps[2].review_records_statistic.count) * 100) || 0;
        // 一审提交通过率
        this.reviewFirstAdopt = res.review_steps[0].review_records_statistic.conclusion_statistic.neutral;
        this.reviewFirstLikeAdopt = (res.review_steps[0].review_records_statistic.conclusion_statistic.neutral /
          res.review_steps[0].review_records_statistic.count) * 100;
        // 二审提交通过率
        this.reviewSecondAdopt = res.review_steps[1].review_records_statistic.conclusion_statistic.neutral;
        this.reviewSecondLikeAdopt = (res.review_steps[1].review_records_statistic.conclusion_statistic.neutral /
          res.review_steps[1].review_records_statistic.count) * 100;
        // 三审提交通过率
        this.reviewThirdAdopt = res.review_steps[2].review_records_statistic.conclusion_statistic.neutral;
        this.reviewThirdLikeAdopt = (res.review_steps[2].review_records_statistic.conclusion_statistic.neutral /
          res.review_steps[2].review_records_statistic.count) * 100;
        // 总分
        // console.log(res);
        this.secondAvg = res.review_steps[1].review_records_statistic.score_statistic.avg;
        this.thirdAvg = res.review_steps[2].review_records_statistic.score_statistic.avg;
        this.stepsNumber = res.step_number;
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
    // this.player.clearInterval();
    clearInterval(this.destroyTimers);
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
    this.seriesService.getPubDetialsTypeList(this.samplePagination, this.id, 'sample').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      // console.log(s);
      this.sampleList = s.list;
      this.isId = this.sampleList[0].id;
      this.samplePagination = s.pagination;
      if (this.sampleList.length > 0) {
        // this.sampleName = this.sampleList[this.sampleIndex].name;
        // this.sampleSrc = this.sampleList[this.sampleIndex].src;
        // this.samplePoster = this.sampleList[this.sampleIndex].poster;
        this.sampleName = this.sampleList[0].name;
        this.sampleSrc = this.sampleList[0].src;
        this.samplePoster = this.sampleList[0].poster;
        this.samplePageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.sampleSrc, this.samplePoster);
        // this.playerSource('http://test.static.bctop.net/马术-24/马术-hls/playlist.m3u8', this.samplePoster);
      }
    });
  }

  getFeatureInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.featurePagination, this.id, 'feature').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.featureList = s.list;
      this.isId = this.featureList[0].id;
      this.featurePagination = s.pagination;
      if (this.featureList.length > 0) {
        this.featureName = this.featureList[0].name;
        this.featureSrc = this.featureList[0].src;
        this.featurePoster = this.featureList[0].poster;
        this.featurePageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.featureSrc, this.featurePoster);
      }
      // this.featureList = s.list;
      // console.log(this.isId);
      // this.featurePagination = s.pagination;
      // if (this.featureList.length > 0) {
      //   this.featureName = this.featureList[0].name;
      //   this.featureSrc = this.featureList[0].src;
      //   this.featurePoster = this.featureList[0].poster;
      //   this.featurePageChange({ page: 1, pageSize: 20 });
      //   this.playerSource(this.featureSrc, this.featurePoster);
      // }
    });
  }

  getTrailerInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.trailerPagination, this.id, 'trailer').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      // console.log(s);
      this.trailerList = s.list;
      this.isId = this.trailerList[0].id;
      this.trailerPagination = s.pagination;
      if (this.trailerList.length > 0) {
        this.trailerName = this.trailerList[0].name;
        this.trailerSrc = this.trailerList[0].src;
        this.trailerPoster = this.trailerList[0].poster;
        this.trailerPageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.trailerSrc, this.trailerPoster);
      }
      // this.trailerList = s.list;
      // this.trailerPagination = s.pagination;
      // if (this.trailerList.length > 0) {
      //   this.trailerName = this.trailerList[this.trailerIndex].name;
      //   this.trailerSrc = this.trailerList[this.trailerIndex].src;
      //   this.trailerPoster = this.trailerList[this.trailerIndex].poster;
      //   this.trailerPageChange({ page: 1, pageSize: 20 });
      //   this.playerSource(this.trailerSrc, this.trailerPoster);
      // }
    });
  }

  getPosterInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.posterPagination, this.id, 'poster').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      // this.posterList = s.list;
      // this.trailerPagination = s.pagination;
      // if (this.posterList.length > 0) {
      //   this.posterName = this.posterList[this.posterIndex].name;
      //   this.posterSrc = this.posterList[this.posterIndex].src;
      //   this.posterPageChange({ page: 1, pageSize: 20 });
      this.posterList = s.list;
      this.isId = this.posterList[0].id;
      this.posterPagination = s.pagination;
      if (this.posterList.length > 0) {
        this.posterName = this.posterList[0].name;
        this.posterSrc = this.posterList[0].src;
        this.posterPageChange({ page: 1, pageSize: 20 });
      }
      // }
    });
  }

  getStillInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.stillPagination, this.id, 'still').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.stillList = s.list;
      this.isId = this.stillList[0].id;
      this.stillPagination = s.pagination;
      if (this.stillList.length > 0) {
        this.stillName = this.stillList[0].name;
        this.stillSrc = this.stillList[0].src;
        this.stillPageChange({ page: 1, pageSize: 20 });
      }
    });
  }

  getPdfInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPubDetialsTypeList(this.pdfPagination, this.id, 'pdf').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.pdfList = s.list;
      this.pdfPagination = s.pagination;
      if (this.pdfList.length > 0) {
        this.isId = this.pdfList[0].id;
        this.pdfName = this.pdfList[0].name;
        this.pdfSrc = this.pdfList[0].src;
        // this.pdfSrc = 'http://192.168.1.109:8000/media_files/720fa654-3d79-11e9-91a9-685b35a5b556.pdf';
        this.pdfPage = 1;
        this.pdfPageChange({ page: 1, pageSize: 20 });
      }
      // this.pdfList = s.list;
      // this.pdfPagination = s.pagination;
      // if (this.pdfList.length > 0) {
      //   this.pdfName = this.pdfList[this.pdfIndex].name;
      //   this.pdfSrc = this.pdfList[this.pdfIndex].src;
      //   this.pdfPage = 1;
      //   this.pdfPageChange({ page: 1, pageSize: 20 });
      // }
    });
  }

  samplePageChange(pageData) {
    const list = this.sampleList;
    this.sampleNum = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  }

  featurePageChange(pageData) {
    const list = this.featureList;
    // console.log(this.featureList);
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


  // lastPoster() {
  //   if (this.posterIndex > 0) {
  //     this.posterIndex = this.posterIndex - 1;
  //     this.posterName = this.posterList[this.posterIndex].name;
  //     this.posterSrc = this.posterList[this.posterIndex].src;
  //   } else { }
  // }

  // nextPoster() {
  //   if (this.posterIndex + 1 < this.posterList.length) {
  //     this.posterIndex = this.posterIndex + 1;
  //     this.posterSrc = this.posterList[this.posterIndex].src;
  //     this.posterName = this.posterList[this.posterIndex].name;
  //   } else { }
  // }

  // lastStill() {
  //   if (this.stillIndex > 0) {
  //     this.stillIndex = this.stillIndex - 1;
  //     this.stillName = this.stillList[this.stillIndex].name;
  //     this.stillSrc = this.stillList[this.stillIndex].src;
  //   } else { }
  // }

  // nextStill() {
  //   if (this.stillIndex + 1 < this.stillList.length) {
  //     this.stillIndex = this.stillIndex + 1;
  //     this.stillSrc = this.stillList[this.stillIndex].src;
  //     this.stillName = this.stillList[this.stillIndex].name;
  //   } else { }
  // }

  // lastPdf() {
  //   if (this.pdfPage > 0) {
  //     this.pdfPage = this.pdfPage - 1;
  //   } else { }
  // }

  // nextPdf() {
  //   this.pdfPage = this.pdfPage + 1;
  // }

  lastPoster() {
    if (this.posterIndex > 0) {
      this.posterIndex = this.posterIndex - 1;
      // this.posterName = this.posterList[this.posterIndex].name;
      // this.posterSrc = this.posterList[this.posterIndex].src;

      // tslint:disable-next-line:max-line-length
      this.seriesService.getPublicitiesTypeList(this.posterPagination, this.id, 'poster').pipe(tap(x => {
        let index = 1;
        x.list.forEach(f => {
          f.displayText = index++;
        });
      })).subscribe(s => {
        this.posterList = s.list;
        this.isId = this.posterList[this.posterIndex].id;
        this.posterPagination = s.pagination;
        if (this.posterList.length > 0) {
          this.posterName = this.posterList[this.posterIndex].name;
          this.posterSrc = this.posterList[this.posterIndex].src;
          this.posterPageChange({ page: 1, pageSize: 20 });
        }
      });
    } else { }
  }

  nextPoster() {
    if (this.posterIndex + 1 < this.posterList.length) {
      this.posterIndex = this.posterIndex + 1;
      // this.posterSrc = this.posterList[this.posterIndex].src;
      // this.posterName = this.posterList[this.posterIndex].name;
      // tslint:disable-next-line:max-line-length
      this.seriesService.getPublicitiesTypeList(this.posterPagination, this.id, 'poster').pipe(tap(x => {
        let index = 1;
        x.list.forEach(f => {
          f.displayText = index++;
        });
      })).subscribe(s => {
        this.posterList = s.list;
        this.isId = this.posterList[this.posterIndex].id;
        this.posterPagination = s.pagination;
        if (this.posterList.length > 0) {
          this.posterName = this.posterList[this.posterIndex].name;
          this.posterSrc = this.posterList[this.posterIndex].src;
          this.posterPageChange({ page: 1, pageSize: 20 });
        }
      });
    } else { }
  }

  lastStill() {
    if (this.stillIndex > 0) {
      this.stillIndex = this.stillIndex - 1;
      // this.stillName = this.stillList[this.stillIndex].name;
      // this.stillSrc = this.stillList[this.stillIndex].src;
      // tslint:disable-next-line:max-line-length
      this.seriesService.getPublicitiesTypeList(this.stillPagination, this.id, 'still').pipe(tap(x => {
        let index = 1;
        x.list.forEach(f => {
          f.displayText = index++;
        });
      })).subscribe(s => {
        this.stillList = s.list;
        this.isId = this.stillList[this.stillIndex].id;
        this.stillPagination = s.pagination;
        if (this.stillList.length > 0) {
          this.stillName = this.stillList[this.stillIndex].name;
          this.stillSrc = this.stillList[this.stillIndex].src;
          this.stillPageChange({ page: 1, pageSize: 20 });
        }
      });
    } else { }
  }

  nextStill() {
    if (this.stillIndex + 1 < this.stillList.length) {
      this.stillIndex = this.stillIndex + 1;
      // this.stillSrc = this.stillList[this.stillIndex].src;
      // this.stillName = this.stillList[this.stillIndex].name;
      // tslint:disable-next-line:max-line-length
      this.seriesService.getPublicitiesTypeList(this.stillPagination, this.id, 'still').pipe(tap(x => {
        let index = 1;
        x.list.forEach(f => {
          f.displayText = index++;
        });
      })).subscribe(s => {
        this.stillList = s.list;
        this.isId = this.stillList[this.stillIndex].id;
        this.stillPagination = s.pagination;
        if (this.stillList.length > 0) {
          this.stillName = this.stillList[this.stillIndex].name;
          this.stillSrc = this.stillList[this.stillIndex].src;
          this.stillPageChange({ page: 1, pageSize: 20 });
        }
      });
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
    this.isId = id;
    // console.log(this.isId);
    this.sampleIndex = i - 1;
    this.publicityType = 'sample';
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { sampleIndex: this.sampleIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.samplePagination, this.id, 'sample').pipe(tap(x => {
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
      }
    });
    // this.realTimePlayback = this.player.currentTime();
    // console.log(this.realTimePlayback, '1');
    // this.seriesService.addReviewtrajectory(this.rid, this.publicityType,
    //    this.isId, this.realTimePlayback, this.status).subscribe(res => {
    //   console.log(res);
    //   console.log(444);
    // });
  }

  featureNavigateToDetail(i: number, id: number) {
    this.isId = id;
    // console.log(this.isId);
    this.featureIndex = i - 1;
    this.publicityType = 'feature';
    this.seriesService.getPublicitiesTypeList(this.featurePagination, this.id, 'feature').pipe(tap(x => {
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
    // this.realTimePlayback = this.player.currentTime();
    // this.seriesService.addReviewtrajectory(this.rid,
    //    this.publicityType, this.isId, this.realTimePlayback, this.status).subscribe(res => {
    // });
  }

  trailerNavigateToDetail(i: number, id: number) {
    this.isId = id;
    this.trailerIndex = i - 1;
    this.publicityType = 'trailer';
    this.seriesService.getPublicitiesTypeList(this.trailerPagination, this.id, 'trailer').pipe(tap(x => {
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

  posterNavigateToDetail(i: number, id: number) {
    this.posterIndex = i;
    this.isId = id;
    this.publicityType = 'poster';
    this.seriesService.getPublicitiesTypeList(this.posterPagination, this.id, 'poster').pipe(tap(x => {
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

  stillNavigateToDetail(i: number, id: number) {
    this.stillIndex = i;
    this.isId = id;
    this.publicityType = 'still';
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { stillIndex: this.stillIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.stillPagination, this.id, 'still').pipe(tap(x => {
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

  pdfNavigateToDetail(i: number, id: number) {
    this.pdfIndex = i;
    this.publicityType = 'pdf';
    this.isId = id;
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.pdfPagination, this.id, 'pdf').pipe(tap(x => {
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
        this.pdfPage = 1;
        this.pdfPageChange({ page: 1, pageSize: 20 });
      }
    });
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { pdfIndex: this.pdfIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  sample() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'sample';
    this.getSampleInfo();
  }

  feature() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'feature';
    this.getFeatureInfo();
  }

  trailer() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'trailer';
    this.getTrailerInfo();
  }

  poster() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'poster';
    this.getPosterInfo();
  }

  still() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'still';
    this.getStillInfo();
  }

  pdf() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'pdf';
    this.getPdfInfo();
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
    // console.log(event.index);
    this.step_number = event.index;
  }

  verifySelectChange(event) {
    this.selectedIndex = event.index;
    // console.log(this.selectedIndex, 'selectedIndex');
  }

  shareEmail() {
    // console.log(this.tabIndex);
    // tslint:disable-next-line:max-line-length
    this.seriesService.shareEmail(this.emailAddress, `http://test1.bctop.net/d/${this.id}`, this.publicityName, this.sid).subscribe();
  }
  ShowSelect(i) {
    // console.log(i);
    this.totalHeight = 0;
    this.isFixed = false;
    this.currentIndex = i;
    this.isShowSelect = true;
    if (this.selectedIndex === 0) {
      this.handleSelected(i, this.reviewFirstSteps, 1);
    } else if (this.selectedIndex === 1) {
      this.handleSelected(i, this.reviewSecondSteps, 1);
    } else {
      this.handleSelected(i, this.reviewThirdSteps, 1);
    }
  }
  NoShowSelect(i) {
    this.totalHeight = 0;
    this.currentIndex = i;
    this.isShowSelect = false;
    if (this.selectedIndex === 0) {
      this.handleSelected(i, this.reviewFirstSteps, 2);
    } else if (this.selectedIndex === 1) {
      this.handleSelected(i, this.reviewSecondSteps, 2);
    } else {
      this.handleSelected(i, this.reviewThirdSteps, 2);
    }
  }
  // 初始化点击时的数据
  handleSelected(i, reviewData, type) {
    if (type === 1) {
      reviewData.review_records[i].isUp = true;
    } else {
      reviewData.review_records[i].isUp = false;
    }
    setTimeout(() => {
      reviewData.review_records.forEach((item, index) => {
        if (this.selectedIndex === 0) {
          item.wrapperHeight = this.elementFristView.nativeElement.querySelectorAll('.result-wrapper')[index].offsetHeight;
        } else if (this.selectedIndex === 1) {
          item.wrapperHeight = this.elementSecondView.nativeElement.querySelectorAll('.result-wrapper')[index].offsetHeight;
        } else {
          item.wrapperHeight = this.elementThirdView.nativeElement.querySelectorAll('.result-wrapper')[index].offsetHeight;
        }
      });
    }, 100);
  }
}

