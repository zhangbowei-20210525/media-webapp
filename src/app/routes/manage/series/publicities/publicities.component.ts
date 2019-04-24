import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SeriesService } from '../series.service';
import { PaginationDto } from '@shared';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { AddPublicityComponent } from '../components/add-publicity/add-publicity.component';
import { finalize, switchMap } from 'rxjs/operators';
import { fadeIn } from '@shared/animations';

@Component({
  selector: 'app-publicities',
  templateUrl: './publicities.component.html',
  styleUrls: ['./publicities.component.less'],
  animations: [fadeIn]
})
export class PublicitiesComponent implements OnInit {
  @ViewChild('publicityOk') publicityOk: any;
  readonly fileFilters = ['.mp4', '.avi', '.rmvb', '.wmv', '.mkv', '.mov', '.flv', '.mpeg', '.vob', '.webm', '.mpg', '.mxf'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  allChecked = false;
  indeterminate = false;
  displayData = [];
  pagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
  tbPagination = { page: 1, count: 10, page_size: 16 } as PaginationDto;
  publicitiesList = [];
  addPublicityModal: NzModalRef;
  publicityId: number;
  isLoading: boolean;
  isLoaded: boolean;
  dataset: any;
  disabledButton: any;
  publicityStyle = 'figure';
  thumbnailList = [];
  search: any;

  constructor(
    private router: Router,
    private service: SeriesService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.tbPagination.page = +params.get('page') || 1;
        this.search = params.get('search');
        if (this.search === null) {
          return this.service.getThumbnail(this.tbPagination);
        } else {
          return this.service.getSearchThumbnail(this.search, this.tbPagination);
        }
      })).subscribe(res => {
        this.thumbnailList = res.list;
        this.tbPagination = res.pagination;
      });
  }

  fetchPublicities() {
    this.isLoading = true;
    this.isLoaded = true;
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.search = params.get('search');
        console.log(this.search);
        if (this.search === null) {
          return this.service.getPublicities(this.pagination);
        } else {
          return  this.service.getSearchPublicities(this.search, this.pagination);
        }
      })).pipe(finalize(() => {
        this.isLoading = false;
        if (!this.isLoaded) {
          this.isLoaded = true;
        }
      })).subscribe(result => {
        this.dataset = result.list;
        this.pagination = result.pagination;
      });
  }

  pageChnage(page: number) {
    this.pagination.page = page;
    this.fetchPublicities();
  }

  tbPageChange() {
    const page = this.tbPagination.page;
    if (page < 1 || page > this.tbPagination.pages) {
      return;
    }
    this.router.navigate([`/medias/movies/${page}`], { relativeTo: this.route });
  }

  refreshStatus(): void {
    const allChecked = this.dataset.every(value => value.checked === true);
    const allUnChecked = this.dataset.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataset.some(value => value.checked);
  }

  checkedChange() {
    this.refreshStatus();
  }

  checkAll(value: boolean): void {
    this.dataset.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  publicityDetails(id: number) {
    this.router.navigate([`/manage/series/d/${id}/publicityd`]);
  }

  addPublicity() {
    this.addPublicityModal = this.modal.create({
      nzTitle: '新增宣发',
      nzContent: AddPublicityComponent,
      nzMaskClosable: true,
      nzClosable: true,
      nzOkText: null,
      nzCancelText: '取消',
      nzWidth: 800,
      nzFooter: this.publicityOk
    });
  }

  publicityUpload(event) {
    const component = this.addPublicityModal.getContentComponent();
    if (component.validation()) {
      if (component.submit().type === 'sample') {
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
        const data = { name: component.submit().program_name, program_type: component.submit().program_type };
        this.service.addSeries(data).subscribe(s => {
          const sid = s.id;
          this.service.getUploadVideoId(fileList[0]).subscribe(res => {
            const id = res.id;
            this.service.getPublicitiesList(sid).subscribe(pl => {
              this.publicityId = pl.list[0].id;
              this.service.addUpload(this.publicityId, id, component.submit().type).subscribe(i => {
                this.message.success(this.translate.instant('global.upload-success'));
                this.addPublicityModal.close();
                this.router.navigate([`/manage/series/d/${sid}/publicityd`]);
              });
            });
          });
        });
      }
      if (component.submit().type === 'feature') {
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
        const data = { name: component.submit().program_name, program_type: component.submit().program_type };
        this.service.addSeries(data).subscribe(s => {
          const sid = s.id;
          this.service.getUploadVideoId(fileList[0]).subscribe(res => {
            const id = res.id;
            this.service.getPublicitiesList(sid).subscribe(pl => {
              this.publicityId = pl.list[0].id;
              this.service.addUpload(this.publicityId, id, component.submit().type).subscribe(i => {
                this.message.success(this.translate.instant('global.upload-success'));
                this.addPublicityModal.close();
                this.router.navigate([`/manage/series/d/${sid}/publicityd`]);
              });
            });
          });
        });
      }
      if (component.submit().type === 'trailer') {
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
        const data = { name: component.submit().program_name, program_type: component.submit().program_type };
        this.service.addSeries(data).subscribe(s => {
          const sid = s.id;
          this.service.getUploadVideoId(fileList[0]).subscribe(res => {
            const id = res.id;
            this.service.getPublicitiesList(sid).subscribe(pl => {
              this.publicityId = pl.list[0].id;
              this.service.addUpload(this.publicityId, id, component.submit().type).subscribe(i => {
                this.message.success(this.translate.instant('global.upload-success'));
                this.addPublicityModal.close();
                this.router.navigate([`/manage/series/d/${sid}/publicityd`]);
              });
            });
          });
        });
      }
      if (component.submit().type === 'poster') {
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
        const data = { name: component.submit().program_name, program_type: component.submit().program_type };
        this.service.addSeries(data).subscribe(s => {
          const sid = s.id;
          this.service.getUploadImageId(fileList[0]).subscribe(result => {
            const id = result.id;
            this.service.getPublicitiesList(sid).subscribe(pl => {
              this.publicityId = pl.list[0].id;
              this.service.addUpload(this.publicityId, id, component.submit().type).subscribe(i => {
                this.message.success(this.translate.instant('global.upload-success'));
                this.addPublicityModal.close();
                this.router.navigate([`/manage/series/d/${sid}/publicityd`]);
              });
            });
          });
        });
      }
      if (component.submit().type === 'still') {
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
        console.log(component.submit().name);
        const data = { name: component.submit().program_name, program_type: component.submit().program_type };
        this.service.addSeries(data).subscribe(s => {
          const sid = s.id;
          this.service.getUploadImageId(fileList[0]).subscribe(result => {
            const id = result.id;
            this.service.getPublicitiesList(sid).subscribe(pl => {
              this.publicityId = pl.list[0].id;
              this.service.addUpload(this.publicityId, id, component.submit().type).subscribe(i => {
                this.message.success(this.translate.instant('global.upload-success'));
                this.addPublicityModal.close();
                this.router.navigate([`/manage/series/d/${sid}/publicityd`]);
              });
            });
          });
        });
      }
      if (component.submit().type === 'pdf') {
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
        const data = { name: component.submit().program_name, program_type: component.submit().program_type };
        this.service.addSeries(data).subscribe(s => {
          const sid = s.id;
          this.service.getUploadPdfId(fileList[0]).subscribe(res => {
            const id = res.id;
            this.service.getPublicitiesList(sid).subscribe(pl => {
              this.publicityId = pl.list[0].id;
              this.service.addUpload(this.publicityId, id, component.submit().type).subscribe(i => {
                this.message.success(this.translate.instant('global.upload-success'));
                this.addPublicityModal.close();
                this.router.navigate([`/manage/series/d/${sid}/publicityd`]);
              });
            });
          });
        });
      }
    } else { }
  }
  thumbnailDetail(id: number) {
    this.router.navigate([`/manage/series/d/${id}/publicityd`]);
  }

  publicityPlay(id: number, sid: number) {
    this.router.navigate([`/manage/series/publicity-details/${id}`, { sid: sid }]);
  }

  publicityStyleChange(event) {
    if (event === 'table') {
      this.fetchPublicities();
    } else {
      this.service.getThumbnail(this.tbPagination).subscribe(res => {
        this.thumbnailList = res.list;
        this.tbPagination = res.pagination;
      });
    }
  }
}
