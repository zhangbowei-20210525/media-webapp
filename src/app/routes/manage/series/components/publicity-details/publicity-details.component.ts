import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SeriesService } from '../../series.service';
import { switchMap, tap } from 'rxjs/operators';
import { PaginationDto } from '@shared';

declare function videojs(selector: string);

@Component({
  selector: 'app-publicity-details',
  templateUrl: './publicity-details.component.html',
  styleUrls: ['./publicity-details.component.less']
})
export class PublicityDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

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

  fixationInfo: any; // 可能是用户信息

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService,
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
        this.sampleIndex = +params.get('sampleIndex');
        this.featureIndex = +params.get('featureIndex');
        this.trailerIndex = +params.get('trailerIndex');
        this.posterIndex = +params.get('posterIndex');
        this.stillIndex = +params.get('stillIndex');
        this.pdfIndex = +params.get('pdfIndex');
        return this.seriesService.publicityDetail(this.id);
      })).subscribe(res => {
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
    //   this.mediasService.getTwoDimensionalCode(this.id).pipe(
    //     tap(x => x.data = `data:image/png;base64,${x.data}`))
    //     .subscribe(res => this.twoDimensionalCode = res.data);
  }

  ngAfterViewInit() {
    this.player = videojs('#video_player');
    this.player.width(800);
    this.player.height(470);
    this.player.load();
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
    this.seriesService.getPublicitiesTypeList(this.samplePagination, this.id, 'sample').pipe(tap(x => {
      let index = 1;
      x.data.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.sampleList = s.data.list;
      this.samplePagination = s.data.pagination;
      if (this.sampleList.length > 0) {
        this.sampleName = this.sampleList[this.sampleIndex].name;
        this.sampleSrc = this.sampleList[this.sampleIndex].src;
        this.samplePoster = this.sampleList[this.sampleIndex].poster;
        this.samplePageChange({ page: 1, pageSize: 20 });
        this.playerSource(this.sampleSrc, this.samplePoster);
      }
    });
  }

  getFeatureInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.featurePagination, this.id, 'feature').pipe(tap(x => {
      let index = 1;
      x.data.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.featureList = s.data.list;
      this.featurePagination = s.data.pagination;
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
    this.seriesService.getPublicitiesTypeList(this.trailerPagination, this.id, 'trailer').pipe(tap(x => {
      let index = 1;
      x.data.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      this.trailerList = s.data.list;
      this.trailerPagination = s.data.pagination;
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
    this.seriesService.getPublicitiesTypeList(this.posterPagination, this.id, 'poster').pipe(tap(x => {
      let index = 1;
      x.data.list.forEach(f => {
        f.displayText = index++;
      });
      x.data.list[0].src = '/assets/imaaa/1.jpg';
      x.data.list[1].src = '/assets/imaaa/2.jpg';
      x.data.list[2].src = '/assets/imaaa/3.jpg';
    })).subscribe(s => {
      this.posterList = s.data.list;
      this.trailerPagination = s.data.pagination;
      if (this.posterList.length > 0) {
        this.posterName = this.posterList[this.posterIndex].name;
        this.posterSrc = this.posterList[this.posterIndex].src;
        this.posterPageChange({ page: 1, pageSize: 20 });
      }
    });
  }

  getStillInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.stillPagination, this.id, 'still').pipe(tap(x => {
      let index = 1;
      x.data.list.forEach(f => {
        f.displayText = index++;
      });
      x.data.list[0].src = '/assets/imaaa/4.jpg';
      x.data.list[1].src = '/assets/imaaa/5.jpg';
      x.data.list[2].src = '/assets/imaaa/6.jpg';
    })).subscribe(s => {
      this.stillList = s.data.list;
      this.stillPagination = s.data.pagination;
      if (this.stillList.length > 0) {
        this.stillName = this.stillList[this.stillIndex].name;
        this.stillSrc = this.stillList[this.stillIndex].src;
        this.stillPageChange({ page: 1, pageSize: 20 });
      }
    });
  }

  getPdfInfo() {
     // tslint:disable-next-line:max-line-length
     this.seriesService.getPublicitiesTypeList(this.pdfPagination, this.id, 'pdf').pipe(tap(x => {
      let index = 1;
      x.data.list.forEach(f => {
        f.displayText = index++;
      });
      x.data.list[0].src = '/assets/imaaa/bc.pdf';
      x.data.list[1].src = '/assets/imaaa/xx.pdf';
    })).subscribe(s => {
      this.pdfList = s.data.list;
      this.pdfPagination = s.data.pagination;
      if (this.pdfList.length > 0) {
        this.pdfName = this.pdfList[this.pdfIndex].name;
        this.pdfSrc = this.pdfList[this.pdfIndex].src;
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
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { sampleIndex: this.sampleIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  featureNavigateToDetail(i: number, id: number) {
    this.featureIndex = i - 1;
    this.publicityType = 'feature';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { featureIndex: this.featureIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  trailerNavigateToDetail(i: number, id: number) {
    this.trailerIndex = i - 1;
    this.publicityType = 'trailer';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { trailerIndex: this.trailerIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  posterNavigateToDetail(i: number) {
    this.posterIndex = i;
    this.publicityType = 'poster';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { posterIndex: this.posterIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  stillNavigateToDetail(i: number) {
    this.stillIndex = i;
    this.publicityType = 'still';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { stillIndex: this.stillIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  pdfNavigateToDetail(i: number) {
    this.pdfIndex = i;
    this.publicityType = 'pdf';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { pdfIndex: this.pdfIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }
  sample() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'sample';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { sampleIndex: this.sampleIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  feature() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'feature';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { featureIndex: this.featureIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  trailer() {
    this.ishidden = false;
    this.player.pause();
    this.publicityType = 'trailer';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { trailerIndex: this.trailerIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  poster() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'poster';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { posterIndex: this.posterIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }
  still() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'still';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { stillIndex: this.stillIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

  pdf() {
    this.ishidden = true;
    this.player.pause();
    this.publicityType = 'pdf';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { pdfIndex: this.pdfIndex, publicityType: this.publicityType }], { relativeTo: this.route });
  }

}
