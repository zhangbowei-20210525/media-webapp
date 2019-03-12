import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SeriesService } from '../series.service';
import { PaginationDto } from '@shared';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { AddPublicityComponent } from '../components/add-publicity/add-publicity.component';

@Component({
  selector: 'app-publicities',
  templateUrl: './publicities.component.html',
  styleUrls: ['./publicities.component.less']
})
export class PublicitiesComponent implements OnInit {
  @ViewChild('publicityOk') publicityOk: any;
  readonly fileFilters = ['.mp4', '.avi', '.rmvb', '.wmv', '.mkv', '.mov', '.flv', '.mpeg', '.vob', '.webm', '.mpg', '.mxf'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  allChecked = false;
  indeterminate = false;
  displayData = [];
  publicitiesPagination: PaginationDto;
  publicitiesList = [];
  addPublicityModal: NzModalRef;
  publicityId: number;

  constructor(
    private router: Router,
    private seriesService: SeriesService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.publicitiesPagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;
    this.seriesService.eventEmit.subscribe((value: any) => {
      if (value === 'publicitiesRefresh') {
        this.seriesService.getPublicities(this.publicitiesPagination).subscribe(res => {
          this.publicitiesList = res.list;
          this.publicitiesPagination = res.pagination;
        });
      }
    });
    this.seriesService.getPublicities(this.publicitiesPagination).subscribe(res => {
      this.publicitiesList = res.list;
      this.publicitiesPagination = res.pagination;
    });
  }
  currentPageDataChange($event: Array<{
    name: string; sample: number; feature: number; trailer: number;
    poster: number; still: number; pdf: number; checked: boolean
  }>): void {
    this.displayData = $event;
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  refreshStatus(page: number): void {
    this.publicitiesPagination.page = page;
    this.seriesService.getPublicities(this.publicitiesPagination).subscribe(res => {
      this.publicitiesList = res.list;
      this.publicitiesPagination = res.pagination;
    });
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkedChange() {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      data.checked = value;
    });
    const allChecked = this.displayData.every(x => x.checked === true);
    const allUnChecked = this.displayData.every(x => !x.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
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
        const data = { name: component.submit().name, program_type: component.submit().program_type };
        this.seriesService.addSeries(data).subscribe(s => {
          const sid = s.id;
          this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
            const id = res.id;
            this.seriesService.getPublicitiesList(sid).subscribe(pl => {
              this.publicityId = pl.list[0].id;
              this.seriesService.addUpload(this.publicityId, id, component.submit().type).subscribe(i => {
                this.message.success(this.translate.instant('global.upload-success'));
                this.addPublicityModal.close();
                this.router.navigate([`/manage/series/d/${sid}/publicityd`]);
              });
            });
          });
        });
      }
      // if (component.submit() === 'feature') {
      //   let fileList: FileList, folder: string;
      //   try {
      //     fileList = event.target.files as FileList;
      //     folder = ((fileList[0] as any).webkitRelativePath as string).split('/')[0];
      //   } catch (ex) {
      //     return;
      //   }
      //   const list = [] as File[];
      //   for (const key in fileList) {
      //     if (fileList.hasOwnProperty(key)) {
      //       const element = fileList[key];
      //       this.fileFilters.forEach(filter => {
      //         if (element.name.toLowerCase().endsWith(filter)) {
      //           list.push(element);
      //           return;
      //         }
      //       });
      //     }
      //   }
      //   if (list.length < 1) {
      //     this.message.success(this.translate.instant('global.no-valid-file'));
      //     return;
      //   }
      //   this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
      //     const id = res.id;
      //     this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
      //       this.publicityId = pl.list[0].id;
      //       this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
      //         this.message.success(this.translate.instant('global.upload-success'));
      //         this.addPublicityModal.close();
      //         this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
      //       });
      //     });
      //   });
      // }
      // if (component.submit() === 'trailer') {
      //   let fileList: FileList, folder: string;
      //   try {
      //     fileList = event.target.files as FileList;
      //     folder = ((fileList[0] as any).webkitRelativePath as string).split('/')[0];
      //   } catch (ex) {
      //     return;
      //   }
      //   const list = [] as File[];
      //   for (const key in fileList) {
      //     if (fileList.hasOwnProperty(key)) {
      //       const element = fileList[key];
      //       this.fileFilters.forEach(filter => {
      //         if (element.name.toLowerCase().endsWith(filter)) {
      //           list.push(element);
      //           return;
      //         }
      //       });
      //     }
      //   }
      //   if (list.length < 1) {
      //     this.message.success(this.translate.instant('global.no-valid-file'));
      //     return;
      //   }
      //   this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
      //     const id = res.id;
      //     this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
      //       this.publicityId = pl.list[0].id;
      //       this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
      //         this.message.success(this.translate.instant('global.upload-success'));
      //         this.addPublicityModal.close();
      //         this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
      //       });
      //     });
      //   });
      // }
      // if (component.submit() === 'poster') {
      //   let fileList: FileList;
      //   try {
      //     fileList = event.target.files as FileList;
      //   } catch (ex) {
      //     return;
      //   }
      //   const list = [] as File[];
      //   for (const key in fileList) {
      //     if (fileList.hasOwnProperty(key)) {
      //       const element = fileList[key];
      //       this.imageFilters.forEach(filter => {
      //         if (element.name.toLowerCase().endsWith(filter)) {
      //           list.push(element);
      //           return;
      //         }
      //       });
      //     }
      //   }
      //   if (list.length < 1) {
      //     this.message.success(this.translate.instant('global.no-valid-file'));
      //     return;
      //   }
      //   this.seriesService.getUploadImageId(fileList[0]).subscribe(result => {
      //     const id = result.id;
      //     this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
      //       this.publicityId = pl.list[0].id;
      //       this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
      //         this.message.success(this.translate.instant('global.upload-success'));
      //         this.addPublicityModal.close();
      //         this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
      //       });
      //     });
      //   });
      // }
      // if (component.submit() === 'still') {
      //   let fileList: FileList;
      //   try {
      //     fileList = event.target.files as FileList;
      //   } catch (ex) {
      //     return;
      //   }
      //   const list = [] as File[];
      //   for (const key in fileList) {
      //     if (fileList.hasOwnProperty(key)) {
      //       const element = fileList[key];
      //       this.imageFilters.forEach(filter => {
      //         if (element.name.toLowerCase().endsWith(filter)) {
      //           list.push(element);
      //           return;
      //         }
      //       });
      //     }
      //   }
      //   if (list.length < 1) {
      //     this.message.success(this.translate.instant('global.no-valid-file'));
      //     return;
      //   }
      //   this.seriesService.getUploadImageId(fileList[0]).subscribe(result => {
      //     const id = result.id;
      //     this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
      //       this.publicityId = pl.list[0].id;
      //       this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
      //         this.message.success(this.translate.instant('global.upload-success'));
      //         this.addPublicityModal.close();
      //         this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
      //       });
      //     });
      //   });
      // }
      // if (component.submit() === 'pdf') {
      //   let fileList: FileList, folder: string;
      //   try {
      //     fileList = event.target.files as FileList;
      //     folder = ((fileList[0] as any).webkitRelativePath as string).split('/')[0];
      //   } catch (ex) {
      //     return;
      //   }
      //   const list = [] as File[];
      //   for (const key in fileList) {
      //     if (fileList.hasOwnProperty(key)) {
      //       const element = fileList[key];
      //       this.pdfFilters.forEach(filter => {
      //         if (element.name.toLowerCase().endsWith(filter)) {
      //           list.push(element);
      //           return;
      //         }
      //       });
      //     }
      //   }
      //   if (list.length < 1) {
      //     this.message.success(this.translate.instant('global.no-valid-file'));
      //     return;
      //   }
      //   this.seriesService.getUploadPdfId(fileList[0]).subscribe(res => {
      //     const id = res.id;
      //     this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
      //       this.publicityId = pl.list[0].id;
      //       this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
      //         this.message.success(this.translate.instant('global.upload-success'));
      //         this.addPublicityModal.close();
      //         this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
      //       });
      //     });
      //   });
      // }
    } else { }
  }


}
