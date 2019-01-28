import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SeriesService } from '../../series.service';
import { switchMap, tap } from 'rxjs/operators';
import { dtoMap, dtoCatchError } from 'src/app/core/rxjs-pipe-handles';
import { PaginationDto } from 'src/app/shared/dtos/pagination.dto';

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
  selectedGenre: string;
  postersList = [];

  type: string;
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


  imgUrl: string;
  pdfName: string;
  pdfImgUrl: string;
  pdfPostersList = [];
  pdfsIndexNum: number;
  imgIndex: number;
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
  videoType: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.type = 'video';
    this.videoType = 'sample';
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
        return this.seriesService.publicityDetail(this.id);
      })).pipe(dtoMap(e => e.data), dtoCatchError()).subscribe(res => {
        this.publicityName = res.name;
        this.getSampleInfo();
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

  getSampleInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.samplePagination, this.id, 'sample').pipe(dtoMap(e => e.data), dtoCatchError()).pipe(tap(x => {
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
        this.player.pause();
        this.player.poster(this.samplePoster);
        this.player.src('http://vjs.zencdn.net/v/oceans.mp4');
        this.player.load();
      }
    });
  }

  getFeatureInfo () {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.featurePagination, this.id, 'feature').pipe(dtoMap(e => e.data), dtoCatchError()).pipe(tap(x => {
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
        this.player.pause();
        this.player.poster(this.featurePoster);
        this.player.src('http://vjs.zencdn.net/v/oceans.mp4');
        this.player.load();
      }
    });
  }

  getTrailerInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.trailerPagination, this.id, 'trailer').pipe(dtoMap(e => e.data), dtoCatchError()).pipe(tap(x => {
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
        this.player.pause();
        this.player.poster(this.trailerPoster);
        this.player.src('http://vjs.zencdn.net/v/oceans.mp4');
        this.player.load();
      }
    });
  }

  getPosterInfo() {
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.posterPagination, this.id, 'poster').pipe(dtoMap(e => e.data), dtoCatchError()).pipe(tap(x => {
      let index = 1;
      x.list.forEach(f => {
        f.displayText = index++;
      });
    })).subscribe(s => {
      console.log('321654');
      console.log(s);
      this.posterList = s.list;
      this.trailerPagination = s.pagination;
      if (this.posterList.length > 0) {
        this.posterName = this.posterList[this.posterIndex].name;
        this.posterSrc = this.posterList[this.posterIndex].src;
        this.posterPageChange({ page: 1, pageSize: 20 });
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
    this.posterNum = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  }

  // detailInfo() {
      // if (this.detail.posters.length > 0) {
      //   this.postersList = this.detail.posters;
      //   this.imgIndex = 0;
      //   this.posterName = this.detail.posters[this.imgIndex].poster_name;
      //   this.imgUrl = this.detail.posters[this.imgIndex].img_url;
      // }

  //     if (this.detail.pdfs.length > 0) {
  //       this.pdfsLIst = this.detail.pdfs;
  //       this.pdfPage = 1;
  //       this.pdfName = this.detail.pdfs[this.pdfsIndexNum].pdf_name;
  //       this.pdfImgUrl = this.detail.pdfs[this.pdfsIndexNum].pdf_url;
  //       this.pdfPageChange({ page: 1, pageSize: 20 });
  //     }
  // }

  lastImage() {
    if (this.imgIndex > 0) {
      this.imgIndex = this.imgIndex - 1;
      this.imgUrl = this.postersList[this.imgIndex].img_url;
      this.posterName = this.postersList[this.imgIndex].poster_name;
    } else { }
  }

  nextImage() {
    if (this.imgIndex + 1 < this.postersList.length) {
      this.imgIndex = this.imgIndex + 1;
      this.imgUrl = this.postersList[this.imgIndex].img_url;
      this.posterName = this.postersList[this.imgIndex].poster_name;
    } else { }
  }

  lastPdf() {
    if ( this.pdfPage > 0) {
      this.pdfPage = this.pdfPage - 1;
    } else { }
  }

  nextPdf() {
      this.pdfPage = this.pdfPage + 1;
  }



  sampleNavigateToDetail(i: number, id: number) {
      this.sampleIndex = i - 1;
      this.router.navigate([`/manage/series/publicity-details/${this.id}`,
      { sampleIndex: this.sampleIndex}], { relativeTo: this.route });
  }

  featureNavigateToDetail(i: number, id: number) {
    this.featureIndex = i - 1;
      this.router.navigate([`/manage/series/publicity-details/${this.id}`,
      { featureIndex: this.featureIndex}], { relativeTo: this.route });
  }

  trailerNavigateToDetail(i: number, id: number) {
    this.trailerIndex = i - 1;
      this.router.navigate([`/manage/series/publicity-details/${this.id}`,
      { trailerIndex: this.trailerIndex}], { relativeTo: this.route });
  }

  pdfNavigateToDetail(i: number) {
    this.pdfsIndexNum = i;
    this.router.navigate([`/tapes-management/sample-detail/${this.id}`,
    { indexNum: this.pdfsIndexNum}], { relativeTo: this.route });
    // this.mediasService.getMediaDetailKeyframe(this.id, programId).subscribe(res => {
    //   this.keyframe = res.key_frame_list;
    // }
    // );
  }

  // pdfPageChange(pageData) {
  //   if (this.detail.pdfs) {
  //     const list = this.detail.pdfs;
  //     this.pdfPostersList = list.slice((pageData.page - 1) * pageData.pageSize, pageData.page * pageData.pageSize);
  //   }
  // }

  sample () {
    this.type = 'video';
    this.videoType = 'sample';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { sampleIndex: this.sampleIndex}], { relativeTo: this.route });
    this.player.pause();
    this.getSampleInfo();
  }

  feature() {
    this.type = 'video';
    this.videoType = 'feature';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { featureIndex: this.featureIndex}], { relativeTo: this.route });
    this.player.pause();
    this.getFeatureInfo();
  }

  trailer() {
    this.type = 'video';
    this.videoType = 'trailer';
    this.router.navigate([`/manage/series/publicity-details/${this.id}`,
    { trailerIndex: this.trailerIndex}], { relativeTo: this.route });
    this.player.pause();
    this.getTrailerInfo();
  }

  poster() {
    this.type = 'image';
    this.getPosterInfo();
  }
  still() {
    this.type = 'image';
  }

  pdf() {
    this.type = 'pdf';
  }

}
