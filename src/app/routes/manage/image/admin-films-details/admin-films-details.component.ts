
import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SeriesService } from '../../series/series.service';
import { switchMap, tap, map, finalize } from 'rxjs/operators';
import { PaginationDto, MessageService, Util } from '@shared';
import { I18nService } from '@core';
import { TendencyInfoComponent } from '../components/tendency-info/tendency-info.component';
import { NzModalRef, NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { FirstInstanceDetailsComponent } from '../components/first-instance-details/first-instance-details.component';
// import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { Pipe, PipeTransform } from '@angular/core';

declare function videojs(selector: string);

@Component({
  selector: 'app-admin-films-details',
  templateUrl: './admin-films-details.component.html',
  styleUrls: ['./admin-films-details.component.less']
})
export class AdminFilmsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  mouth: any;

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
  ngOnInit() {
    console.log(this.myDate.getFullYear());
    console.log(this.myDate.getMonth() + 1);
    console.log(this.myDate.getDate());
    console.log(Util.dateFullToString(this.myDate));

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
    this.getReviewDetailsView();
  }
  getReviewDetailsView() {
    this.seriesService.getReviewDetails(this.rid)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(res => {
        console.log(res);
        this.reviewList = res;
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
        // 查看更多功能注释
        // if (res.review_steps[0].lenght > 3) {
        // this.reviewFirstSteps = res.review_steps[0].splice(0, 3);
        // } else {
        this.reviewFirstSteps = res.review_steps[0];
        this.reviewSecondSteps = res.review_steps[1];
        this.reviewThirdSteps = res.review_steps[2];
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
              console.log(item.review_at);
              item.review_at = item.review_at;
              console.log(item.review_at);

            }
          } else {
            if (!!item.review_at) {
              item.review_at = item.review_at.split(' ')[0];
            }
            console.log(item.review_at);
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
                console.log(item.review_at);
              }
            } else {
              item.review_at = item.review_at;
              console.log(item.review_at);

            }
          } else {
            if (!!item.review_at) {
              item.review_at = item.review_at.split(' ')[0];
            }
            console.log(item.review_at);
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
        console.log(this.secondOppose);

        // 三审喜欢人数及通过率
        this.thirdLikePeople = res.review_steps[2].review_records_statistic.conclusion_statistic.agree;
        this.thirdDisLikePeople = res.review_steps[2].review_records_statistic.conclusion_statistic.oppose;
        this.thirdLike = ((res.review_steps[2].review_records_statistic.conclusion_statistic.agree /
          res.review_steps[2].review_records_statistic.reviewed_count) * 100) || 0;
        this.thirdOppose = ((res.review_steps[2].review_records_statistic.conclusion_statistic.oppose /
          res.review_steps[2].review_records_statistic.reviewed_count) * 100) || 0;
        console.log(this.thirdOppose);
        // 总分
        console.log(res);
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
    this.seriesService.getPubDetialsTypeList(this.featurePagination, this.id, 'feature').pipe(tap(x => {
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
    this.seriesService.getPubDetialsTypeList(this.trailerPagination, this.id, 'trailer').pipe(tap(x => {
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
    this.seriesService.getPubDetialsTypeList(this.posterPagination, this.id, 'poster').pipe(tap(x => {
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
    this.seriesService.getPubDetialsTypeList(this.stillPagination, this.id, 'still').pipe(tap(x => {
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
    this.seriesService.getPubDetialsTypeList(this.pdfPagination, this.id, 'pdf').pipe(tap(x => {
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
    this.router.navigate([`/manage/image/admin-films-details/${this.id}`,
    { sampleIndex: this.sampleIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  featureNavigateToDetail(i: number, id: number) {
    this.featureIndex = i - 1;
    this.publicityType = 'feature';
    this.router.navigate([`/manage/image/admin-films-details/${this.id}`,
    { featureIndex: this.featureIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  trailerNavigateToDetail(i: number, id: number) {
    this.trailerIndex = i - 1;
    this.publicityType = 'trailer';
    this.router.navigate([`/manage/image/admin-films-details/${this.id}`,
    { trailerIndex: this.trailerIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  posterNavigateToDetail(i: number) {
    this.posterIndex = i;
    this.publicityType = 'poster';
    this.router.navigate([`/manage/image/admin-films-details/${this.id}`,
    { posterIndex: this.posterIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  stillNavigateToDetail(i: number) {
    this.stillIndex = i;
    this.publicityType = 'still';
    this.router.navigate([`/manage/image/admin-films-details/${this.id}`,
    { stillIndex: this.stillIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
  }

  pdfNavigateToDetail(i: number) {
    this.pdfIndex = i;
    this.publicityType = 'pdf';
    this.router.navigate([`/manage/image/admin-films-details/${this.id}`,
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
    console.log(this.selectedIndex);
  }

  shareEmail() {
    // console.log(this.tabIndex);
    // tslint:disable-next-line:max-line-length
    this.seriesService.shareEmail(this.emailAddress, `http://test1.bctop.net/d/${this.id}`, this.publicityName, this.sid).subscribe();
  }
  ShowSelect() {
    this.isShowSelect = true;
  }
  NoShowSelect() {
    this.isShowSelect = false;
  }
  // 查看更多
  // getMore() {
  //   console.log('getmore');
  //   this.reviewFirstSteps = this.reviewList.review_steps[0];
  // }

}

