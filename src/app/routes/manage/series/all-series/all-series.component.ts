import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SeriesService } from '../series.service';
import { PaginationDto } from '@shared';
import { finalize } from 'rxjs/operators';
import { AddSeriesInfoComponent } from '../components/add-series-info/add-series-info.component';
import { SeriesDto } from './dtos';
import { fadeIn } from '@shared/animations';
import { AddPublicityComponent } from '../components/add-publicity/add-publicity.component';
import { AddSourceComponent } from '../components/add-source/add-source.component';
import { AddRightComponent } from '../components/add-right/add-right.component';
import { Router } from '@angular/router';
import { AddTapeComponent } from '../components/add-tape/add-tape.component';

@Component({
  selector: 'app-all-series',
  templateUrl: './all-series.component.html',
  styleUrls: ['./all-series.component.less'],
  animations: [fadeIn]
})
export class AllSeriesComponent implements OnInit {

  @ViewChild('publicityOk') publicityOk: any;

  readonly fileFilters = ['.mp4', '.avi', '.rmvb', '.wmv', '.mkv', '.mov', '.flv', '.mpeg', '.vob', '.webm', '.mpg', '.mxf'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];

  dataset: SeriesDto[] = [];
  isLoaded = false;
  isLoading: boolean;
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  allChecked: boolean;
  indeterminate: boolean;
  disabledButton: boolean;
  isVisiblePublicity = false;
  addPublicityModal: NzModalRef;
  id: number;
  publicityId: number;

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
    private seriesService: SeriesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadSeries();
  }

  loadSeries() {
    this.isLoading = true;
    this.seriesService.getSeries(this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
      }))
      .subscribe(res => {
        this.dataset = res.list;
        this.pagination = res.pagination;
        this.refreshStatus();
      });
  }

  fetchSeries() {
    this.isLoading = true;
    this.seriesService.getSeries(this.pagination).pipe(finalize(() => this.isLoading = false)).subscribe(res => {
      this.dataset = res.list;
      this.pagination = res.pagination;
      this.refreshStatus();
    });
  }

  refreshDataSet() {
    this.fetchSeries();
  }

  seriesDetails(id: number) {
    console.log(id);
    this.router.navigate([`/manage/series/d/${id}`, { sif: 'show'}]);
  }

  refreshStatus(): void {
    const allChecked = this.dataset.length > 0 ? this.dataset.every(value => value.checked === true) : false;
    const allUnChecked = this.dataset.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataset.some(value => value.checked);
  }

  checkAll(value: boolean): void {
    this.dataset.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.refreshDataSet();
  }

  addSeries() {
    this.modal.create({
      nzTitle: '新增节目',
      nzContent: AddSeriesInfoComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addSeriesAgreed
    });
  }

  addSeriesAgreed = (component: AddSeriesInfoComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit().subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
        this.refreshDataSet();
        resolve();
      }, error => {
        reject(false);
      });
    } else {
      reject(false);
    }
  })

  deleteSeries(id: number) {
    this.modal.confirm({
      nzTitle: '是否删除本条节目信息?',
      nzOkText: '删除',
      nzCancelText: '取消',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteSeriesAgreed(id)
    });
  }

  deleteSeriesAgreed = (id: number) => new Promise((resolve) => {
    this.seriesService.deleteSeries(id).subscribe(res => {
      this.seriesService.getSeries(this.pagination).subscribe(s => {
        this.dataset = s.list;
        this.pagination = s.pagination;
      });
      this.message.success(this.translate.instant('global.delete-success'));
      resolve();
    }, error => {
      if (error.message) {
        this.message.error(error.message);
      }
      resolve(false);
    });
  })

  addPublicity(id: number) {
    this.id = id;
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

  tapeDetails(id: number) {
    this.seriesService.getTapeList(id).subscribe(res => {
      const tapeId = res[0].id;
    this.router.navigate([`/manage/series/d/${id}/tape`, { tapeId: tapeId}]);
  });
}

  publicityUpload(event) {
    const component = this.addPublicityModal.getContentComponent();
    if (component.validation()) {
      console.log(component.submit());
    if (component.submit() === 'sample') {
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
      this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
          this.publicityId = pl.list[0].id;
          this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
            this.message.success(this.translate.instant('global.upload-success'));
            this.addPublicityModal.close();
            this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
          });
        });
      });
    }
    if (component.submit() === 'feature') {
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
      this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
          this.publicityId = pl.list[0].id;
          this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
            this.message.success(this.translate.instant('global.upload-success'));
            this.addPublicityModal.close();
            this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
          });
        });
      });
    }
    if (component.submit() === 'trailer') {
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
      this.seriesService.getUploadVideoId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
          this.publicityId = pl.list[0].id;
          this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
            this.message.success(this.translate.instant('global.upload-success'));
            this.addPublicityModal.close();
            this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
          });
        });
      });
    }
    if (component.submit() === 'poster') {
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
      this.seriesService.getUploadImageId(fileList[0]).subscribe(result => {
        const id = result.id;
        this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
          this.publicityId = pl.list[0].id;
          this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
            this.message.success(this.translate.instant('global.upload-success'));
            this.addPublicityModal.close();
            this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
          });
        });
      });
    }
    if (component.submit() === 'still') {
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
      this.seriesService.getUploadImageId(fileList[0]).subscribe(result => {
        const id = result.id;
        this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
          this.publicityId = pl.list[0].id;
          this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
            this.message.success(this.translate.instant('global.upload-success'));
            this.addPublicityModal.close();
            this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
          });
        });
      });
    }
    if (component.submit() === 'pdf') {
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
      this.seriesService.getUploadPdfId(fileList[0]).subscribe(res => {
        const id = res.id;
        this.seriesService.getPublicitiesList(this.id).subscribe(pl => {
          this.publicityId = pl.list[0].id;
          this.seriesService.addUpload(this.publicityId, id, component.submit()).subscribe(i => {
            this.message.success(this.translate.instant('global.upload-success'));
            this.addPublicityModal.close();
            this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
          });
        });
      });
    }
   } else { }
  }

  addSource(id: number) {
this.id = id;
    this.modal.create({
      nzTitle: `新增母带`,
      nzContent: AddTapeComponent,
      nzComponentParams: { id: this.id },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addTapeAgreed
    });
  }
  addTapeAgreed = (component: AddTapeComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
        this.seriesService.getTapeList(this.id).subscribe(tape => {
          const tapeId = tape[0].id;
        this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: tapeId}]);
      });
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  addRight() {
    this.modal.create({
      nzTitle: '新增宣发',
      nzContent: AddRightComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addRightAgreed
    });
  }

  addRightAgreed = (component: AddRightComponent) => new Promise((resolve) => {
    // component.formSubmit()
    //   .subscribe(res => {
    //     this.message.success(this.translate.instant('global.add-success'));
    //     this.seriesService.pubTapeList(this.isId, this.pubTapePagination).subscribe(p => {
    //       this.pubTapeList = p.list;
    //       this.pubTapePagination = p.pagination;
    //     });
    //     resolve();
    //   }, error => {
    //     if (error.message) {
    //       this.message.error(error.message);
    //     }
    //   });
  })

}
