
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
  selector: 'app-films-details',
  templateUrl: './films-details.component.html',
  styleUrls: ['./films-details.component.less']
})
export class FilmsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

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
  verify: number;
  comment = '';

  starArray = [];
  // firstObj = {};
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
  reviewSteps = [];

  secondAvg: any;
  thirdAvg: any;
  stepsNumber: any;
  likePeople: any;
  disLikePeople: any;
  secondLikePeople: any;
  secondDisLikePeople: any;
  secondLike: number;
  secondOppose: number;

  thirdLikePeople: any;
  thirdDisLikePeople: any;
  thirdLike: number;
  thirdOppose: number;

  starId = [];
  reviewId: any;
  rid: number;

  scoreFirstList = [];
  nameFirstList = [];
  scoreSecondList = [];
  nameSecondList = [];
  nameThirdList = [];
  scoreThirdList = [];
  myDate = new Date();

  reviewFirstAdopt: any;
  reviewFirstLikeAdopt: number;
  reviewSecondAdopt: any;
  reviewSecondLikeAdopt: number;
  reviewThirdAdopt: any;
  reviewThirdLikeAdopt: number;
  destroyTimers: NodeJS.Timer;

  realTimePlayback: number;
  status: string;
  isId: any;
  publicityId: any;
  isClear: boolean;

  isTabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService,
    private modalService: NzModalService,
    private i18n: I18nService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.isTabIndex = 3;
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
        return this.seriesService.pubDetail(this.id);
      })).subscribe(res => {
        // console.log(res);
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
    this.seriesService.getReviewDetails(this.rid).subscribe(res => {
      console.log(res, 'tytytyt');
      this.reviewSteps = res.review_steps;
      if (res.step_number === 1) {
        res.review_steps[0].scoring_items.forEach((item) => {
          this.starId.push({ id: item.id, score: 0 });
        });
      }
      this.reviewFirstSteps = res.review_steps[0];
      if (res.review_steps.length > 1) {
        this.reviewSecondSteps = res.review_steps[1];
      }
      if (res.review_steps.length > 2) {
        this.reviewThirdSteps = res.review_steps[2];
      }
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
      if (res.review_steps.length > 1) {
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
            // console.log(item.review_at);
            item.review_at = item.review_at;
            // console.log(item.review_at);

          }
        } else {
          if (!!item.review_at) {
            item.review_at = item.review_at.split(' ')[0];
          }
          // console.log(item.review_at);
        }
      });
    }
    if (res.review_steps.length > 2) {
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
              // console.log(item.review_at);
            }
          } else {
            item.review_at = item.review_at;
            // console.log(item.review_at);

          }
        } else {
          if (!!item.review_at) {
            item.review_at = item.review_at.split(' ')[0];
          }
          // console.log(item.review_at);
        }
      });
    }
      // console.log(res);
      // ???????????????
      this.scoreFirstList = res.review_steps[0].review_records_statistic.score_statistic.item_statistic;
      this.nameFirstList = res.review_steps[0].scoring_items;
      this.nameFirstList.forEach((item, index) => {
        item.avg = (this.scoreFirstList[index].avg) / 2;
      });
      // ???????????????
      if (res.review_steps.length > 1) {
      this.scoreSecondList = res.review_steps[1].review_records_statistic.score_statistic.item_statistic;
      this.nameSecondList = res.review_steps[1].scoring_items;
      this.nameSecondList.forEach((item, index) => {
        item.avg = (this.scoreSecondList[index].avg) / 2;
      });
    }
      // ???????????????
      if (res.review_steps.length > 2) {
      this.scoreThirdList = res.review_steps[2].review_records_statistic.score_statistic.item_statistic;
      this.nameThirdList = res.review_steps[2].scoring_items;
      this.nameThirdList.forEach((item, index) => {
        item.avg = (this.scoreThirdList[index].avg) / 2;
      });
      this.reviewFirstSteps = res.review_steps[0];
      this.reviewFirstSteps.review_records.forEach(b => {
       b.total_score = b.total_score / 2;
      });
    }
      // ??????????????????????????????
      this.likePeople = res.review_steps[0].review_records_statistic.conclusion_statistic.agree;
      this.disLikePeople = res.review_steps[0].review_records_statistic.conclusion_statistic.oppose;
      this.firstLike = (res.review_steps[0].review_records_statistic.conclusion_statistic.agree /
        res.review_steps[0].review_records_statistic.count) * 100;
      this.firstOppose = (res.review_steps[0].review_records_statistic.conclusion_statistic.oppose /
        res.review_steps[0].review_records_statistic.count) * 100;
      // ??????????????????????????????
      if (res.review_steps.length > 1) {
      this.reviewSecondSteps = res.review_steps[1];
      this.reviewSecondSteps.review_records.forEach(b => {
        b.total_score = b.total_score / 2;
      });
      this.secondLikePeople = res.review_steps[1].review_records_statistic.conclusion_statistic.agree;
      this.secondDisLikePeople = res.review_steps[1].review_records_statistic.conclusion_statistic.oppose;
      this.secondLike = (res.review_steps[1].review_records_statistic.conclusion_statistic.agree /
        res.review_steps[1].review_records_statistic.count) * 100;
      this.secondOppose = (res.review_steps[1].review_records_statistic.conclusion_statistic.oppose /
        res.review_steps[1].review_records_statistic.count) * 100;
      }
      // ?????????????????????
      this.reviewFirstAdopt = res.review_steps[0].review_records_statistic.conclusion_statistic.neutral;
      this.reviewFirstLikeAdopt = (res.review_steps[0].review_records_statistic.conclusion_statistic.neutral /
        res.review_steps[0].review_records_statistic.count) * 100;
      // ?????????????????????
      if (res.review_steps.length > 1) {
      this.reviewSecondAdopt = res.review_steps[1].review_records_statistic.conclusion_statistic.neutral;
      this.reviewSecondLikeAdopt = (res.review_steps[1].review_records_statistic.conclusion_statistic.neutral /
        res.review_steps[1].review_records_statistic.count) * 100;
      }
      // ??????
      // this.reviewSecondSteps = res.review_steps[1];
      if (res.review_steps.length > 2) {
      this.reviewThirdSteps = res.review_steps[2];
      this.reviewThirdSteps.review_records.forEach(b => {
        b.total_score = b.total_score / 2;
      });
    }

      if (res.step_number === 2) {
        res.review_steps[1].scoring_items.forEach((item) => {
          this.starId.push({ id: item.id, score: 0 });
        });
      }
      if (res.review_steps.length > 2) {
      this.reviewThirdSteps = res.review_steps[2];
      if (res.step_number === 3) {
        res.review_steps[2].scoring_items.forEach((item) => {
          this.starId.push({ id: item.id, score: 0 });
        });
      }
    }
      // console.log(this.starId, 'i am star');
      if (res.review_steps.length > 1) {
      this.secondAvg = res.review_steps[1].review_records_statistic.score_statistic.avg;
      }
      if (res.review_steps.length > 2) {
      this.thirdAvg = res.review_steps[2].review_records_statistic.score_statistic.avg;
      }
      this.stepsNumber = res.step_number;
      this.reviewId = res.reviewer_status.review_step_number;
    });
    // ?????????????????????????????????
    // this.giveVideoStatus();
    this.listenVideoTime();
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
      // console.log(s.list);
      this.isId = this.sampleList[0].id;
      this.realTimePlayback = 0;
      this.status = 'play';
      this.getVideoStatus();
      this.giveVideoStatus(this.tabIndex);
      this.samplePagination = s.pagination;
      if (this.sampleList.length > 0) {
        this.sampleName = this.sampleList[0].name;
        this.sampleSrc = this.sampleList[0].src;
        this.samplePoster = this.sampleList[0].poster;
        this.samplePageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.sampleSrc, this.samplePoster);
        // this.playerSource('http://test.static.bctop.net/??????-24/??????-hls/playlist.m3u8', this.samplePoster);
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
      // console.log(s.list);
      this.isId = this.featureList[0].id;
      this.realTimePlayback = 0;
      this.status = 'play';
      this.giveVideoStatus(this.tabIndex);
      this.featurePagination = s.pagination;
      if (this.featureList.length > 0) {
        this.featureName = this.featureList[0].name;
        this.featureSrc = this.featureList[0].src;
        this.featurePoster = this.featureList[0].poster;
        this.featurePageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.featureSrc, this.featurePoster);
      }
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
      this.realTimePlayback = 0;
      this.status = 'play';
      this.giveVideoStatus(this.tabIndex);
      this.trailerPagination = s.pagination;
      if (this.trailerList.length > 0) {
        this.trailerName = this.trailerList[0].name;
        this.trailerSrc = this.trailerList[0].src;
        this.trailerPoster = this.trailerList[0].poster;
        this.trailerPageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.trailerSrc, this.trailerPoster);
      }
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
      this.posterList = s.list;
      this.isId = this.posterList[0].id;
      this.realTimePlayback = 0;
      this.status = 'play';
      this.giveVideoStatus(this.tabIndex);
      this.isClear = true;
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
      this.realTimePlayback = 0;
      this.status = 'play';
      this.giveVideoStatus(this.tabIndex);
      this.isClear = true;
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
        this.realTimePlayback = 0;
        this.status = 'play';
        this.giveVideoStatus(this.tabIndex);
        this.isClear = true;
        this.pdfName = this.pdfList[0].name;
        this.pdfSrc = this.pdfList[0].src;
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
    this.publicityType = 'sample';
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
    this.realTimePlayback = 0;
    this.isClear = false;
    this.giveVideoStatus(this.tabIndex);
  }

  featureNavigateToDetail(i: number, id: number) {
    this.isId = id;
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
    this.realTimePlayback = 0;
    this.isClear = false;
    this.giveVideoStatus(this.tabIndex);
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
    this.realTimePlayback = 0;
    this.isClear = false;
    this.giveVideoStatus(this.tabIndex);
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
    this.realTimePlayback = 0;
    this.isClear = false;
    this.giveVideoStatus(this.tabIndex);
  }

  stillNavigateToDetail(i: number, id: number) {
    this.stillIndex = i;
    this.isId = id;
    this.publicityType = 'still';
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
    this.realTimePlayback = 0;
    this.isClear = false;
    this.giveVideoStatus(this.tabIndex);
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
    this.realTimePlayback = 0;
    this.isClear = false;
    this.giveVideoStatus(this.tabIndex);
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
    this.getVideoStatus();
  }

  trailer() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'trailer';
    this.getTrailerInfo();
    this.getVideoStatus();
  }

  poster() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'poster';
    this.getPosterInfo();
    this.getVideoStatus();
  }
  still() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'still';
    this.getStillInfo();
    this.getVideoStatus();
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
    // this.selectedIndex = 1;
    this.selectedIndex = event.index;
    // console.log(this.selectedIndex);
  }
  shareEmail() {
    // console.log(this.tabIndex);
    // tslint:disable-next-line:max-line-length
    this.seriesService.shareEmail(this.emailAddress, `http://test1.bctop.net/d/${this.id}`, this.publicityName, this.sid).subscribe();
  }

  // ??????????????????
  choseTendency() {
    this.modalService.create({
      nzTitle: `????????????`,
      nzContent: TendencyInfoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 440,
      nzOkText: '??????',
      nzCancelText: '??????',
      nzOnOk: () => new Promise((resolve) => {
        resolve();
        this.router.navigate([`/manage/image/verify-films`]);
      }),
      nzNoAnimation: true,
    });
  }

  // ??????????????????
  choseIsLike(data) {
    this.verify = Number(data);
    // console.log(data);
  }
  // ?????????
  textareaValue(data) {
    this.comment = data;
  }
  // ??????????????????
  // submit() {
  //   this.modalService.create({
  //     nzTitle: `????????????`,
  //     nzContent: FirstInstanceDetailsComponent,
  //     // nzComponentParams: { id: this.publicityId },
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: 400,
  //     nzOkText: '??????',
  //     nzCancelText: '??????',
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
  //         this.message.error('?????????????????????');
  //       } else {
  //         this.seriesService.submitFirstInstanceDetails(conclusion, scoring, comment, this.id).subscribe(res => {
  //           console.log(res);
  //         });
  //         this.message.success('????????????');
  //         this.router.navigate([`manage/image`]);
  //       }
  //     }),
  //     // nzOnOk: (component: FirstInstanceDetailsComponent) => this.shareBusinessmen(component),
  //   });
  // }

  // ?????????
  textareaValueSecond(data) {
    this.comment = data;
    // console.log(data);
  }
  // ??????????????????
  // submitSecond() {
  //   this.modalService.create({
  //     nzTitle: `????????????`,
  //     nzContent: FirstInstanceDetailsComponent,
  //     // nzComponentParams: { id: this.publicityId },
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: 400,
  //     nzOkText: '??????',
  //     nzCancelText: '??????',
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
  //         this.message.error('?????????????????????');
  //       } else {
  //         this.seriesService.submitSecondInstanceDetails(conclusion, scoring, comment, this.id).subscribe(res => {
  //           console.log(res);
  //         });
  //         this.router.navigate([`manage/image`]);
  //         this.message.success('????????????');
  //       }
  //     }),
  //     // nzOnOk: (component: FirstInstanceDetailsComponent) => this.shareBusinessmen(component),
  //   });
  // }
  // ??????

  textareaValueThird(data) {
    this.comment = data;
    // console.log(data);
  }
  // ??????????????????
  submitThird() {
    // console.log(this.verify, '11111');
    if (this.verify === undefined) {
      // console.log(1);
      this.message.error('?????????????????????');
      return;
    }
    const starList = this.starId.filter(item => {
      return item.score === 0;
    });
    if (starList.length > 0) {
      // console.log(2);
      this.message.error('?????????????????????');
      return;
    }
    this.modalService.create({
      nzTitle: `????????????`,
      nzContent: FirstInstanceDetailsComponent,
      // nzComponentParams: { id: this.publicityId },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 400,
      nzOkText: '??????',
      nzCancelText: '??????',
      nzNoAnimation: true,
      nzOnOk: () => new Promise((resolve) => {
        resolve();
        const conclusion = this.verify;
        const comment = this.comment;
        const scoring = this.starId;
        this.seriesService.submitThreeInstanceDetails(conclusion, scoring, comment, this.reviewId).subscribe(res => {
          // console.log(res);
        });
        this.router.navigate([`manage/image/review-view`]);
        this.message.success('??????????????????,????????????!');
        // }
      }),
    });
  }
  // ??????????????????
  firstChange(score, item, index: number) {
    // console.log(this.starId);
    // console.log(score, item, index, 'i am wrong');
    this.starId[index].id = item.id;
    this.starId[index].score = score * 2;
  }
  // ??????????????????????????????
  getVideoStatus() {
    this.player.on('timeupdate', () => {
      // tslint:disable-next-line:radix
      this.isClear = false;
      // tslint:disable-next-line:radix
      this.realTimePlayback = parseInt(this.player.currentTime());
      this.status = 'play';
    });
    this.player.on('play', () => {
      this.isClear = false;
      this.status = 'play';
      // tslint:disable-next-line:radix
      this.realTimePlayback = parseInt(this.player.currentTime());
      this.giveVideoStatus(this.tabIndex);
    });
    this.player.on('ended', () => {
      this.isClear = true;
      this.status = 'stop';
      // tslint:disable-next-line:radix
      this.realTimePlayback = parseInt(this.player.currentTime());
      this.giveVideoStatus(this.tabIndex);
    });
    this.player.on('pause', () => {
      this.isClear = true;
      this.status = 'stop';
      // tslint:disable-next-line:radix
      this.realTimePlayback = parseInt(this.player.currentTime());
      this.giveVideoStatus(this.tabIndex);
    });
  }

  // ???????????????????????????????????????(????????????????????????)
  listenVideoTime() {
    this.destroyTimers = setInterval(() => {
      if (this.isClear || this.status === 'stop') {
      } else {
        this.giveVideoStatus(this.tabIndex);
      }
    }, 10000);
  }

  // ???????????????
  giveVideoStatus(n: number) {
    // if (!this.isId) {
    // ???????????????????????????,??????????????????????????????????????????
    // this.publicityType = 'feature';
    // this.isId = 45;
    //   this.tabIndex = n;
    //   this.realTimePlayback = 0;
    //   this.status = 'play';
    // this.getIsId();
    //   console.log(this.isId);
    // }
    this.seriesService.addReviewtrajectory(this.rid, this.publicityType, this.isId, this.realTimePlayback, this.status).subscribe(res => {
    });
  }
  getIsId() {
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
    this.seriesService.getPublicitiesTypeList(this.stillPagination, this.id, this.publicityType).pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.isId = s.list[0].id;
      console.log(this.isId);
    });
  }
}
