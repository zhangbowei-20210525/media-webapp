import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MessageService, PaginationDto } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from '../../series.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-series-details-publicity',
  templateUrl: './series-details-publicity.component.html',
  styleUrls: ['./series-details-publicity.component.less']
})
export class SeriesDetailsPublicityComponent implements OnInit {

  type: string;
  id: number;
  publicityId: number;
  seriesType: string;
  samplePagination: PaginationDto;
  featurePagination: PaginationDto;
  trailerPagination: PaginationDto;
  posterPagination: PaginationDto;
  stillPagination: PaginationDto;
  pdfPagination: PaginationDto;

  readonly fileFilters = ['.mp4', '.avi', '.rmvb', '.wmv', '.mkv', '.mov', '.flv', '.mpeg', '.vob', '.webm', '.mpg', '.mxf'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  sampleList = [];
  featureList = [];
  trailerList = [];
  posterList = [];
  stillList = [];
  pdfList = [];
  i = 1;
  name: string;
  extension: string;
  size: string;
  uploadStatus: string;

  constructor(
    private message: MessageService,
    private translate: TranslateService,
    private seriesService: SeriesService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.uploadStatus = '正在上传中...';
    this.type = 'sample';
    this.samplePagination = { page: 1, count: 10, page_size: 10000 } as PaginationDto;
    this.featurePagination = { page: 1, count: 10, page_size: 10000 } as PaginationDto;
    this.trailerPagination = { page: 1, count: 10, page_size: 10000 } as PaginationDto;
    this.posterPagination = { page: 1, count: 10, page_size: 10000 } as PaginationDto;
    this.stillPagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
    this.pdfPagination = { page: 1, count: 10, page_size: 5 } as PaginationDto;
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('sid');
        return this.seriesService.getPublicitiesList(this.id);
      })).subscribe(res => {
        this.publicityId = res.list[0].id;
        this.seriesService.getPublicitiesTypeList(this.samplePagination, this.publicityId, this.type).subscribe(s => {
          this.sampleList = s.list;
          this.samplePagination = s.pagination;
        });
      });
  }

  publicityType(type: string) {
    if (type === 'sample') {
      this.type = 'sample';
      this.seriesService.getPublicitiesTypeList(this.samplePagination, this.publicityId, this.type).subscribe(res => {
        this.sampleList = res.list;
        this.samplePagination = res.pagination;
      });
    }
    if (type === 'feature') {
      this.type = 'feature';
      this.seriesService.getPublicitiesTypeList(this.featurePagination, this.publicityId, this.type).subscribe(res => {
        this.featureList = res.list;
        this.featurePagination = res.pagination;
      });
    }
    if (type === 'trailer') {
      this.type = 'trailer';
      this.seriesService.getPublicitiesTypeList(this.trailerPagination, this.publicityId, this.type).subscribe(res => {
        this.trailerList = res.list;
        this.trailerPagination = res.pagination;
      });
    }
    if (type === 'poster') {
      this.type = 'poster';
      this.seriesService.getPublicitiesTypeList(this.posterPagination, this.publicityId, this.type).subscribe(res => {
        this.posterList = res.list;
        this.posterPagination = res.pagination;
      });
    }
    if (type === 'still') {
      this.type = 'still';
      this.seriesService.getPublicitiesTypeList(this.stillPagination, this.publicityId, this.type).subscribe(res => {
        this.stillList = res.list;
        this.stillPagination = res.pagination;
      });
    }
    if (type === 'pdf') {
      this.type = 'pdf';
      this.seriesService.getPublicitiesTypeList(this.pdfPagination, this.publicityId, this.type).subscribe(res => {
        this.pdfList = res.list;
        this.pdfPagination = res.pagination;
      });
    }
  }

  upload(event) {
    if (this.type === 'sample') {
      let fileList: FileList, folder: string;
      try {
        fileList = event.target.files as FileList;
        folder = ((fileList[0] as any).webkitRelativePath as string).split('/')[0];
      } catch (ex) {
        return;
      }
      const list = [] as File[];
      for (const key in fileList) {
        if (fileList.hasOwnProperty(key)) {
          const element = fileList[key];
          this.fileFilters.forEach(filter => {
            if (element.name.toLowerCase().endsWith(filter)) {
              list.push(element);
              return;
            }
          });
        }
      }
      if (list.length < 1) {
        this.message.success(this.translate.instant('global.no-valid-file'));
        return;
      }
      const fileName = fileList[0].name.lastIndexOf('.');
      const fileNameLength = fileList[0].name.length;
      const fileFormat = fileList[0].name.substring(fileName + 1, fileNameLength);
      const fileName1 = fileList[0].name.split('.');
      this.sampleList = [...this.sampleList, {
        name: `${fileName1[0]}`,
        extension: `${fileFormat}`,
        size: `${fileList[0].size}`,
        uploadStatus: `${this.uploadStatus}`
      }];
      this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.addUpload(this.publicityId, id, this.type).subscribe(i => {
          this.seriesService.getPublicitiesTypeList(this.samplePagination, this.publicityId, this.type).subscribe(s => {
            this.sampleList = s.list;
            this.sampleList.forEach(f => {
              f.uploadStatus = '上传成功';
            });
            this.samplePagination = s.pagination;
          });
        });
      });
    }
    if (this.type === 'feature') {
      let fileList: FileList, folder: string;
      try {
        fileList = event.target.files as FileList;
        folder = ((fileList[0] as any).webkitRelativePath as string).split('/')[0];
      } catch (ex) {
        return;
      }
      const list = [] as File[];
      for (const key in fileList) {
        if (fileList.hasOwnProperty(key)) {
          const element = fileList[key];
          this.fileFilters.forEach(filter => {
            if (element.name.toLowerCase().endsWith(filter)) {
              list.push(element);
              return;
            }
          });
        }
      }
      if (list.length < 1) {
        this.message.success(this.translate.instant('global.no-valid-file'));
        return;
      }
      const fileName = fileList[0].name.lastIndexOf('.');
      const fileNameLength = fileList[0].name.length;
      const fileFormat = fileList[0].name.substring(fileName + 1, fileNameLength);
      const fileName1 = fileList[0].name.split('.');
      this.featureList = [...this.featureList, {
        name: `${fileName1[0]}`,
        extension: `${fileFormat}`,
        size: `${fileList[0].size}`,
        uploadStatus: `${this.uploadStatus}`
      }];
      this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.addUpload(this.publicityId, id, this.type).subscribe(i => {
          // tslint:disable-next-line:max-line-length
          this.seriesService.getPublicitiesTypeList(this.featurePagination, this.publicityId, this.type).subscribe(f => {
            this.featureList = f.list;
            this.featureList.forEach(ff => {
              ff.uploadStatus = '上传成功';
            });
            this.featurePagination = f.pagination;
          });
        });
      });
    }
    if (this.type === 'trailer') {
      let fileList: FileList, folder: string;
      try {
        fileList = event.target.files as FileList;
        folder = ((fileList[0] as any).webkitRelativePath as string).split('/')[0];
      } catch (ex) {
        return;
      }
      const list = [] as File[];
      for (const key in fileList) {
        if (fileList.hasOwnProperty(key)) {
          const element = fileList[key];
          this.fileFilters.forEach(filter => {
            if (element.name.toLowerCase().endsWith(filter)) {
              list.push(element);
              return;
            }
          });
        }
      }
      if (list.length < 1) {
        this.message.success(this.translate.instant('global.no-valid-file'));
        return;
      }
      const fileName = fileList[0].name.lastIndexOf('.');
      const fileNameLength = fileList[0].name.length;
      const fileFormat = fileList[0].name.substring(fileName + 1, fileNameLength);
      const fileName1 = fileList[0].name.split('.');
      this.trailerList = [...this.trailerList, {
        name: `${fileName1[0]}`,
        extension: `${fileFormat}`,
        size: `${fileList[0].size}`,
        uploadStatus: `${this.uploadStatus}`
      }];
      this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.addUpload(this.publicityId, id, this.type).subscribe(i => {
          // tslint:disable-next-line:max-line-length
          this.seriesService.getPublicitiesTypeList(this.trailerPagination, this.publicityId, this.type).subscribe(t => {
            this.trailerList = t.list;
            this.trailerList.forEach(f => {
              f.uploadStatus = '上传成功';
            });
            this.trailerPagination = t.pagination;
          });
        });
      });
    }
    if (this.type === 'poster') {
      let fileList: FileList;
      try {
        fileList = event.target.files as FileList;
      } catch (ex) {
        return;
      }
      const list = [] as File[];
      for (const key in fileList) {
        if (fileList.hasOwnProperty(key)) {
          const element = fileList[key];
          this.imageFilters.forEach(filter => {
            if (element.name.toLowerCase().endsWith(filter)) {
              list.push(element);
              return;
            }
          });
        }
      }
      if (list.length < 1) {
        this.message.success(this.translate.instant('global.no-valid-file'));
        return;
      }
      const fileName = fileList[0].name.lastIndexOf('.');
      const fileNameLength = fileList[0].name.length;
      const fileFormat = fileList[0].name.substring(fileName + 1, fileNameLength);
      const fileName1 = fileList[0].name.split('.');
      this.posterList = [...this.posterList, {
        name: `${fileName1[0]}`,
        extension: `${fileFormat}`,
        size: `${fileList[0].size}`,
        uploadStatus: `${this.uploadStatus}`
      }];
      this.seriesService.getUploadImageId(fileList[0]).subscribe(result => {
        const id = result.id;
        this.seriesService.addUpload(this.publicityId, id, this.type).subscribe(i => {
          // tslint:disable-next-line:max-line-length
          this.seriesService.getPublicitiesTypeList(this.posterPagination, this.publicityId, this.type).subscribe(p => {
            this.posterList = p.list;
            this.posterList.forEach(f => {
              f.uploadStatus = '上传成功';
            });
            this.posterPagination = p.pagination;
          });
        });
      });
    }
    if (this.type === 'still') {
      let fileList: FileList;
      try {
        fileList = event.target.files as FileList;
      } catch (ex) {
        return;
      }
      const list = [] as File[];
      for (const key in fileList) {
        if (fileList.hasOwnProperty(key)) {
          const element = fileList[key];
          this.imageFilters.forEach(filter => {
            if (element.name.toLowerCase().endsWith(filter)) {
              list.push(element);
              return;
            }
          });
        }
      }
      if (list.length < 1) {
        this.message.success(this.translate.instant('global.no-valid-file'));
        return;
      }
      const fileName = fileList[0].name.lastIndexOf('.');
      const fileNameLength = fileList[0].name.length;
      const fileFormat = fileList[0].name.substring(fileName + 1, fileNameLength);
      const fileName1 = fileList[0].name.split('.');
      this.stillList = [...this.stillList, {
        name: `${fileName1[0]}`,
        extension: `${fileFormat}`,
        size: `${fileList[0].size}`,
        uploadStatus: `${this.uploadStatus}`
      }];
      this.seriesService.getUploadImageId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.addUpload(this.publicityId, id, this.type).subscribe(i => {
          // tslint:disable-next-line:max-line-length
          this.seriesService.getPublicitiesTypeList(this.stillPagination, this.publicityId, this.type).subscribe(s => {
            this.stillList = s.list;
            this.stillList.forEach(f => {
              f.uploadStatus = '上传成功';
            });
            this.stillPagination = s.pagination;
          });
        });
      });
    }
    if (this.type === 'pdf') {
      let fileList: FileList, folder: string;
      try {
        fileList = event.target.files as FileList;
        folder = ((fileList[0] as any).webkitRelativePath as string).split('/')[0];
      } catch (ex) {
        return;
      }
      const list = [] as File[];
      for (const key in fileList) {
        if (fileList.hasOwnProperty(key)) {
          const element = fileList[key];
          this.pdfFilters.forEach(filter => {
            if (element.name.toLowerCase().endsWith(filter)) {
              list.push(element);
              return;
            }
          });
        }
      }
      if (list.length < 1) {
        this.message.success(this.translate.instant('global.no-valid-file'));
        return;
      }
      const fileName = fileList[0].name.lastIndexOf('.');
      const fileNameLength = fileList[0].name.length;
      const fileFormat = fileList[0].name.substring(fileName + 1, fileNameLength);
      const fileName1 = fileList[0].name.split('.');
      this.pdfList = [...this.pdfList, {
        name: `${fileName1[0]}`,
        extension: `${fileFormat}`,
        size: `${fileList[0].size}`,
        uploadStatus: `${this.uploadStatus}`
      }];
      this.seriesService.getUploadPdfId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.addUpload(this.publicityId, id, this.type).subscribe(i => {
          // tslint:disable-next-line:max-line-length
          this.seriesService.getPublicitiesTypeList(this.pdfPagination, this.publicityId, this.type).subscribe(p => {
            this.pdfList = p.list;
            this.pdfList.forEach(f => {
              f.uploadStatus = '上传成功';
            });
            this.pdfPagination = p.pagination;
          });
        });
      });

    }
  }

  samplePageChange(page: number) {
    this.samplePagination.page = page;
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.samplePagination, this.publicityId, this.type).subscribe(res => {
      this.sampleList = res.list;
      this.samplePagination = res.pagination;
    });
  }

  featurePageChange(page: number) {
    this.featurePagination.page = page;
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.featurePagination, this.publicityId, this.type).subscribe(res => {
      this.featureList = res.list;
      this.featurePagination = res.pagination;
    });
  }

  trailerPageChange(page: number) {
    this.trailerPagination.page = page;
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.trailerPagination, this.publicityId, this.type).subscribe(res => {
      this.trailerList = res.list;
      this.trailerPagination = res.pagination;
    });
  }

  posterPageChange(page: number) {
    this.posterPagination.page = page;
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.posterPagination, this.publicityId, this.type).subscribe(res => {
      this.posterList = res.list;
      this.posterPagination = res.pagination;
    });
  }

  stillPageChange(page: number) {
    this.stillPagination.page = page;
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.stillPagination, this.publicityId, this.type).subscribe(res => {
      this.stillList = res.list;
      this.stillPagination = res.pagination;
    });
  }

  pdfPageChange(page: number) {
    this.pdfPagination.page = page;
    // tslint:disable-next-line:max-line-length
    this.seriesService.getPublicitiesTypeList(this.pdfPagination, this.publicityId, this.type).subscribe(res => {
      this.pdfList = res.list;
      this.pdfPagination = res.pagination;
    });
  }

  publicityDetails() {
    this.router.navigate([`/manage/series/publicity-details/${this.publicityId}`, {sid: this.id}]);
  }

}
