import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { switchMap, filter, tap } from 'rxjs/operators';
import { SeriesService } from '../series.service';
import { MessageService } from '@shared';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { AddTapeComponent } from '../components/add-tape/add-tape.component';
import { AddPublicityComponent } from '../components/add-publicity/add-publicity.component';
import { EditSeriesInfoComponent } from '../components/edit-series-info/edit-series-info.component';

@Component({
  selector: 'app-series-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
})
export class SeriesDetailsComponent implements OnInit {

  @ViewChild('publicityOk') publicityOk: any;

  readonly fileFilters = ['.mp4', '.avi', '.rmvb', '.wmv', '.mkv', '.mov', '.flv', '.mpeg', '.vob', '.webm', '.mpg', '.mxf'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];

  category: any;
  id: number;
  seriesInfo: any;
  sif: boolean;
  addPublicityModal: NzModalRef;
  publicityId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private modal: NzModalService,
    private translate: TranslateService,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('sid');
        const sif = params.get('sif');
        if (sif === 'show') {
          this.sif = true;
        }
        return this.seriesService.getSeriesDetailsInfo(this.id);
      })
    ).pipe(tap(x => {
        if (x.release_date) {
          x.release_date = x.release_date.substring(0, 10);
        }
    })).subscribe(result => {
      this.seriesInfo = result;
    });
  }


  // tapeDetails () {
  //     if (this.seriesInfo.has_source === false) {
  //       this.sif = false;
  //       this.addSource(this.id);
  //     }
  //     if (this.seriesInfo.has_source === true) {
  //       this.sif = false;
  //       this.seriesService.getTapeList(this.id).subscribe(res => {
  //         const tapeId = res[0].id;
  //       this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: tapeId}]);
  //     });
  //     }
  // }

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
        this.seriesService.getSeriesDetailsInfo(this.id).subscribe(result => {
          this.seriesInfo = result;
        });
        this.message.success(this.translate.instant('global.add-success'));
        this.seriesService.getTapeList(this.id).subscribe(tape => {
          const tapeId = tape[0].id;
          this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: tapeId }]);
        });
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })

  // publicity() {
  //   console.log('1');
  //   if (this.seriesInfo.has_publicity === false) {
  //     this.sif = false;
  //     this.addPublicity(this.id);
  //   }
  //   if (this.seriesInfo.has_publicity === true) {
  //     this.sif = false;
  //     this.router.navigate([`/manage/series/d/${this.id}/publicityd`]);
  //   }
  // }

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

  publicityUpload(event) {
    const component = this.addPublicityModal.getContentComponent();
    if (component.validation()) {
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
            this.fileFilters.forEach(f => {
              if (element.name.toLowerCase().endsWith(f)) {
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
            this.fileFilters.forEach(f => {
              if (element.name.toLowerCase().endsWith(f)) {
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
            this.fileFilters.forEach(f => {
              if (element.name.toLowerCase().endsWith(f)) {
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
            this.imageFilters.forEach(f => {
              if (element.name.toLowerCase().endsWith(f)) {
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
            this.imageFilters.forEach(f => {
              if (element.name.toLowerCase().endsWith(f)) {
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
            this.pdfFilters.forEach(f => {
              if (element.name.toLowerCase().endsWith(f)) {
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

  showInfo() {
    this.sif = !this.sif;
  }

  categories() {
  }

  editSeries() {
    this.modal.create({
      nzTitle: '编辑节目信息',
      nzContent: EditSeriesInfoComponent,
      nzComponentParams: { id: this.id },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.editSeriesAgreed
    });
  }

  editSeriesAgreed = (component: EditSeriesInfoComponent) => new Promise((resolve, reject) => {
    if (component.validation()) {
      component.submit().subscribe(res => {
        this.message.success(this.translate.instant('global.edit-success'));
        this.seriesService.getSeriesDetailsInfo(this.id).subscribe(result => {
          this.seriesInfo = result;
        });
        resolve();
      }, error => {
        reject(false);
      });
    } else {
      reject(false);
    }
  })
}
