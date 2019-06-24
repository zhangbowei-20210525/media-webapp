import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { PaginationDto, MessageService } from '@shared';
import { SeriesService } from '../../series/series.service';
import { PublicityService } from '../../series/details/publicity/publicity.service';
import { QueueUploader } from '@shared/upload';
import { filter } from 'rxjs/operators';
import { CollectionUpComponent } from '../components/collection-up/collection-up.component';


@Component({
  selector: 'app-details-solicitation',
  templateUrl: './details-solicitation.component.html',
  styleUrls: ['./details-solicitation.component.less']
})
export class DetailsSolicitationComponent implements OnInit {
  objParams: { program: any; materials: any[]; publicity_id: any; };
  [x: string]: any;

  readonly fileFilters = ['.mp4', '.avi', '.rmvb', '.wmv', '.mkv', '.mov', '.flv', '.mpeg', '.vob', '.webm', '.mpg', '.mxf'];
  readonly imageFilters = ['.jpg', '.jpeg', '.png'];
  readonly pdfFilters = ['.pdf'];
  validateForm: FormGroup;
  files = [];
  publicityId = '';
  company_ids = [];
  size: any;
  status: any;
  type: any;
  docType: any;
  statusType: any;
  programList = [];
  filterList: any;
  blurData: any;
  forList: any;
  id: any;
  mode: 'figure' | 'table' |  'figure';
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private message: MessageService,
    private seriesService: SeriesService,
    private router: Router,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      nickname: [null, [Validators.required]],
      program_type: [null, [Validators.required]],
      theme: [null],
      episode: [null],
      type: [null, [Validators.required]],
      protagonist: [null],
      director: [null],
      screen_writer: [null],
      supervisor: [null],
      general_producer: [null],
      producer: [null],
      product_company: [null],
      progress: [null],
      introduction: [null]
    });
    this.seriesService.getSamplePublicitys().subscribe(res => {
      this.programList = res.data.list;
    });
  }
  fileType(value) {
    this.docType = this.getUploadUrl(value);
  }
  beforeUpload = (file: File, fileList: any) => {
    const list = [] as File[];
    if (this.docType === '/api/v1/upload/video') {
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
    }
    if (this.docType === '/api/v1/upload/image') {
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
    }
    if (this.docType === '/api/v1/upload/docment') {
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
    }
    if (list.length < 1) {
      this.message.error('无效文件');
      return false;
    } else {
      return true;
    }
  }

  handleChange({ file, fileList }: { [key: string]: any }): void {
    this.files = fileList;
    this.size = file.size / 1000000;
    this.status = file.status;
    this.type = file.type.split('/')[1];
    fileList.forEach(item => {
      if (item.status === 'error') {
        this.statusType = 'exception';
      } else {
        this.statusType = '';
      }
      item.percent = String(item.percent).split('.')[0];
    });

    if (this.validateForm.value.type === 'feature'
      || this.validateForm.value.type === 'sample'
      || this.validateForm.value.type === 'trailer') {
      if (this.size > '1024' && this.status === 'done') {
        this.notification.error('文件上传失败', `请选择符合要求的视频`);
      } else if (this.status === 'done') {
        this.notification.success('文件上传成功', `文件 ${file.name} 上传完成。`);
      } else if (this.status === 'error') {
        this.notification.error('文件上传失败', `文件 ${file.name} 上传失败。`);
      }
    }
     fileList.forEach( b => {
       if (!!b.response) {
         this.id = b.response.id ;
       }
    });
  }
  getUploadUrl(type: string) {
    switch (type) {
      case 'sample':
      case 'feature':
      case 'trailer':
        return '/api/v1/upload/video';
      case 'poster':
      case 'still':
        return '/api/v1/upload/image';
      case 'pdf':
        return '/api/v1/upload/docment';
    }
  }

  validation() {
    const form = this.validateForm;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }
  submit() {
    if (this.validation()) {
      const params = this.validateForm.value;
      const materials = [];
      const shareId = 1;
      const obj = {
        material_id: '',
        material_type: '',
      };
      this.files.forEach(item => {
        obj.material_id = this.id;
        obj.material_type = this.validateForm.value.type;
        materials.push(obj);
      });
    this.objParams = {
        program: params,
        materials: materials,
        publicity_id: this.publicityId,
      };
    this.seriesService.submitCollection(this.objParams, shareId).subscribe(res => {
      if (res.message === 'OK') {
        this.modalService.create({
          nzTitle: ``,
          nzContent: CollectionUpComponent,
          nzMaskClosable: false,
          nzClosable: false,
          nzWidth: 800,
          // nzComponentParams: { programThemes: result.theme, programTypes: result.program_type },
          nzOkText: '前往宣发库',
          nzCancelText: '上传新节目',
          nzOnCancel: () => new Promise((resolve) => {
          resolve();
          this.router.navigate([`/manage/image/details-solicitation`]);
          this.validateForm.reset();
          this.files = [];
          }),
          nzOnOk: () => new Promise((resolve) => {
            resolve();
            this.router.navigate([`/manage/series/publicity`]);
            this.filterList = [];

          }),
          nzNoAnimation: true,
        });
      } else {
        this.message.warning(res.message);
      }
    });
    }
  }
  onInput(data) {
    this.blurData = data;
  }
  onClose(index): void {
    this.files.splice(index, 1);
  }
  preventDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }
  getNewList(data) {
    this.filterList = this.programList.filter(item => {
      return item.name === this.blurData;
    });
    this.publicityId = this.filterList[0].id || null;
    // this.validateForm.get('nickname').setValue(this.filterList[0].program.nickname);
    // if (this.filterList[0].program.nickname === null ) {
    //   this.filterList[0].program.nickname = '';
    // }
    this.validateForm.get('nickname').setValue(
      this.filterList[0].program.nickname = null ? '' : this.filterList[0].program.nickname);
    this.validateForm.get('program_type').setValue(
      this.filterList[0].program.program_type = null ? '' : this.filterList[0].program.program_type);
    this.validateForm.get('theme').setValue(
      this.filterList[0].program.theme = null ? '' : this.filterList[0].program.theme);
    this.validateForm.get('episode').setValue(
      this.filterList[0].program.episode = null ? '' : this.filterList[0].program.episode);
    this.validateForm.get('protagonist').setValue(
      this.filterList[0].program.protagonist = null ? '' : this.filterList[0].program.protagonist);
    this.validateForm.get('director').setValue(
      this.filterList[0].program.director = null ? '' : this.filterList[0].program.director);
    this.validateForm.get('screen_writer').setValue(
      this.filterList[0].program.screen_writer = null ? '' : this.filterList[0].program.screen_writer);
    this.validateForm.get('supervisor').setValue(
      this.filterList[0].program.supervisor = null ? '' : this.filterList[0].program.supervisor);
    this.validateForm.get('general_producer').setValue(
      this.filterList[0].program.general_producer = null ? '' : this.filterList[0].program.general_producer);
    this.validateForm.get('producer').setValue(
      this.filterList[0].program.producer = null ? '' : this.filterList[0].program.producer);
    this.validateForm.get('product_company').setValue(
      this.filterList[0].program.product_company = null ? '' : this.filterList[0].program.product_company);
    this.validateForm.get('progress').setValue(
      this.filterList[0].program.progress = null ? '' : this.filterList[0].program.progress);
    this.validateForm.get('introduction').setValue(
      this.filterList[0].program.introduction = null ? '' : this.filterList[0].program.introduction);
  }
}
