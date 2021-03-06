import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SeriesService } from '../../series.service';
import { switchMap, tap, map } from 'rxjs/operators';
import { PaginationDto } from '@shared';
import { I18nService } from '@core';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { PublicityFilmsComponent } from '../../components/publicity-films/publicity-films.component';
import { NzModalRef, NzModalService, NzMessageService, NzNotificationService } from 'ng-zorro-antd';


declare function videojs(selector: string);

@Component({
  selector: 'app-publicity-details',
  templateUrl: './publicity-details.component.html',
  styleUrls: ['./publicity-details.component.less']
})
export class PublicityDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  liaison_ids: any;
  id: number;
  player: any;
  pdfPage: number;
  twoDimensionalCode: any;

  sampleName: string;
  sampleSrc: string;
  samplePoster: string;
  sampleNum = [];
  sampleIndex: number;
  isId: number;
  playButtonIsSelect: boolean;


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
  publicityId: any;
  samplePagination: PaginationDto;
  featurePagination: PaginationDto;
  trailerPagination: PaginationDto;
  posterPagination: PaginationDto;
  stillPagination: PaginationDto;
  pdfPagination: PaginationDto;
  scrollPagination = { page: 1, page_size: 8 } as PaginationDto;
  sampleList = [];
  featureList = [];
  trailerList = [];
  posterList = [];
  stillList = [];
  pdfList = [];
  ishidden: boolean;
  publicityType = '';
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
  destroyTimers: NodeJS.Timer;
  isClear: boolean;
  status: string;
  realTimePlayback: number;
  kpgjInfo = [];
  data = [];
  fixationInfo: any; // ?????????????????????

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService,
    private i18n: I18nService,
    private modalService: NzModalService,
    private message: NzMessageService,

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
        this.seriesService.getSeriesDetailsInfo(this.sid).subscribe(cpd => {
          this.seriesInfo = cpd;
        });
        this.publicityName = res.name;
        this.publicityId = res.id;
      });
  }

  kpgj() {
    this.kpgjInfo = [];
    this.seriesService.getKpgjInfo(this.id, this.scrollPagination).subscribe(result => {
      this.kpgjInfo = [...this.kpgjInfo, ...result.list];
      this.scrollPagination.count = result.pagination.count;
      this.scrollPagination.pages = result.pagination.pages;
    });
  }

  scroll() {
    if (this.scrollPagination.pages > this.scrollPagination.page) {
      this.scrollPagination.page += 1;
      this.kpgj();
    }
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
    this.seriesService.getPublicitiesTypeList(this.samplePagination, this.id, 'sample').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.sampleList = s.list;
      this.isId = this.sampleList[0].id;
      this.realTimePlayback = 0;
      this.status = 'play';
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
    this.seriesService.getPublicitiesTypeList(this.featurePagination, this.id, 'feature').pipe(tap(x => {
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
    });
  }

  getTrailerInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.trailerPagination, this.id, 'trailer').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
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
    });
  }

  getPosterInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.posterPagination, this.id, 'poster').pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.posterList = s.list;
      this.isId = this.posterList[0].id;
      this.posterPagination = s.pagination;
      if (this.posterList.length > 0) {
        this.posterName = this.posterList[0].name;
        this.posterSrc = this.posterList[0].src;
        this.posterPageChange({ page: 1, pageSize: 20 });
      }
    });
  }

  getStillInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.stillPagination, this.id, 'still').pipe(tap(x => {
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
    this.seriesService.getPublicitiesTypeList(this.pdfPagination, this.id, 'pdf').pipe(tap(x => {
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
  }

  featureNavigateToDetail(i: number, id: number) {
    this.isId = id;
    this.featureIndex = i - 1;
    this.publicityType = 'feature';
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { featureIndex: this.featureIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
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
  }

  trailerNavigateToDetail(i: number, id: number) {
    this.isId = id;
    this.trailerIndex = i - 1;
    this.publicityType = 'trailer';
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { trailerIndex: this.trailerIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
    // tslint:disable-next-line:max-line-length
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
    // this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    // { posterIndex: this.posterIndex, publicityType: this.publicityType, sid: this.sid }], { relativeTo: this.route });
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
    // console.log(event.index);
  }

  shareEmail() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.shareEmail(this.emailAddress, `http://test1.bctop.net/d/${this.id}`, this.publicityName, this.sid).subscribe();
  }

  getBusinessmen() {
    this.modalService.create({
      // nzTitle: `????????????`,
      nzContent: PublicityFilmsComponent,
      nzComponentParams: { id: this.publicityId },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 850,
      nzOkText: '??????',
      nzCancelText: '??????',
      // nzOnOk: () => new Promise((resolve) => {
      //   resolve();
      //   this.router.navigate([`manage/series/publicity-films`]);
      // }),
      nzOnOk: (component: PublicityFilmsComponent) => this.shareBusinessmen(component),
      nzNoAnimation: true,
    });
  }
  // ??????????????????????????????
  shareBusinessmen = (component: PublicityFilmsComponent) => new Promise((resolve, reject) => {
    this.liaison_ids = component.checkedIds;
    if (this.liaison_ids === undefined) {
      this.message.error('???????????????????????????');
      reject(false);
      return;
    }
    this.seriesService.getSharingAuthorization([...this.liaison_ids], this.publicityId)
      .subscribe(result => {
        console.log(result);
        this.message.success('????????????');
      }, error => {
        this.message.error('????????????');
      });
    resolve();
    reject(false);
  })

}
