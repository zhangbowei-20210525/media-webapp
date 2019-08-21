import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { PaginationDto, MessageService } from '@shared';
import { SeriesService } from '../../series/series.service';
import { PublicityService } from '../../series/details/publicity/publicity.service';
import { QueueUploader } from '@shared/upload';
import { filter } from 'rxjs/operators';
import { CollectionUpComponent } from '../components/collection-up/collection-up.component';
import { switchMap, tap, map, finalize, } from 'rxjs/operators';


@Component({
  selector: 'app-details-solicitation',
  templateUrl: './details-solicitation.component.html',
  styleUrls: ['./details-solicitation.component.less']
})
export class DetailsSolicitationComponent implements OnInit {
  objParams: { program: any; materials: any[]; publicity_id: any; };
  name: any;
  extension: any;
  filename: any;
  photoSize: any;
  vid: any;
  videoList = [];
  isFrom: number;
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
  filterList = [];
  blurData: any;
  forList: any;
  id: any;
  mode: 'figure' | 'table' | 'figure';
  programTypeList = [];
  themeList = [];
  uploadVideo = false;
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private message: MessageService,
    private seriesService: SeriesService,
    private router: Router,
    private modalService: NzModalService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.files = [];
    this.videoList = [];
    console.log('11111');
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      nickname: [null],
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
      this.programList = res.list;
    });
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
    });
    this.seriesService.programType().subscribe(res => {
      // console.log(res);
      this.programTypeList = res.program_type_choices;
      this.themeList = res.theme_choices;
    });
  }
  fileType(value) {
    this.docType = this.getUploadUrl(value);
    // console.log(value);
  }
  beforeUpload = (file: File, fileList: any) => {
    const list = [] as File[];
    if (this.docType === 'https://cs.bctop.net:7000/upload/video') {
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
    if (this.docType === 'https://cs.bctop.net:7000/upload/image') {
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
    if (this.docType === 'https://cs.bctop.net:7000/upload/document') {
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
      // console.log(fileList);
    });

    if (this.validateForm.value.type === 'feature'
      || this.validateForm.value.type === 'sample'
      || this.validateForm.value.type === 'trailer') {
      if (this.size > '3072' && this.status === 'done') {
        this.notification.error('文件上传失败', `请选择符合要求的视频`);
      } else if (this.status === 'done') {
        this.notification.success('文件上传成功', `文件 ${file.name} 上传完成。`);
      } else if (this.status === 'error') {
        this.notification.error('文件上传失败', `文件 ${file.name} 上传失败。`);
      }

    }
    if (this.validateForm.value.type === 'poster' || this.validateForm.value.type === 'still') {
      if (this.size > '2' && this.status === 'done') {
        this.notification.error('文件上传失败', `请选择符合要求的照片`);
      } else if (this.status === 'done') {
        this.notification.success('文件上传成功', `文件 ${file.name} 上传完成。`);
      } else if (this.status === 'error') {
        this.notification.error('文件上传失败', `文件 ${file.name} 上传失败。`);
      }
    }
    fileList.forEach(b => {
      if (!!b.response) {
        // this.id = b.response.id ;
        this.extension = b.response.data.extension;
        this.filename = b.response.data.filename;
        this.name = b.response.data.name;
        this.size = b.response.data.size;
      }
    });
    console.log(this.videoList, 'videoList111');
  }
  getUploadUrl(type: string) {
    switch (type) {
      case 'sample':
      case 'feature':
      case 'trailer':
        return 'https://cs.bctop.net:7000/upload/video';
      case 'poster':
      case 'still':
        return 'https://cs.bctop.net:7000/upload/image';
      case 'pdf':
        return 'https://cs.bctop.net:7000/upload/document';
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
    console.log(this.filterList);
    if (this.filterList.length > 0) {
      this.submitConent();
    } else {
      if (this.validation()) {
        this.submitConent();
      }
    }
  }
  submitConent() {
    const params = this.validateForm.value;
    const materials = [];
    this.files.forEach(item => {
      const obj = {
        material_type: '',
        name: '',
        filename: '',
        extension: '',
        size: '',
      };
      // obj.material_id = this.id;
      obj.name = item.response.data.name;
      obj.filename = item.response.data.filename;
      obj.extension = item.response.data.extension;
      obj.size = item.response.data.size;
      obj.material_type = this.validateForm.value.type;
      materials.push(obj);
    });
    const postParams = Object.assign(params);
    delete postParams.type;
    this.objParams = {
      program: postParams,
      materials: materials,
      publicity_id: this.publicityId,
    };
    if (this.objParams.materials.length === 0 && this.videoList.length === 0) {
      this.message.error('请填写完整信息');
      return;
    } else {
      this.seriesService.submitCollection(this.objParams, this.id).subscribe(res => {
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
            this.router.navigate([`/manage/image/details-solicitation/${this.id}`]);
            window.location.reload();
            this.validateForm.reset();
            this.validateForm.enable();
            this.uploadVideo = false;
            this.validateForm = this.validateForm;
            this.videoList = [];
            console.log(this.videoList, 'video');
            this.files = [];
          }),
          nzOnOk: () => new Promise((resolve) => {
            resolve();
            this.router.navigate([`/manage/series/publicity`]);
            this.filterList = [];
          }),
          nzNoAnimation: true,
        });

      }, error => {
        this.message.warning(error.message);
      });
    }
  }
  onInput(data) {
    this.blurData = data;
    // console.log(this.blurData);
  }
  getNewList() {
    this.getDisplayDate();
  }
  onBlur() {
    this.getDisplayDate();
  }
  onClose(index): void {
    this.files.splice(index, 1);
  }
  preventDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }
  getDisplayDate() {
    this.filterList = this.programList.filter(item => {
      console.log(this.filterList);
      return item.name === this.blurData;
    });
    if (this.filterList.length === 0) {
      return;
    } else {
      this.publicityId = this.filterList[0].id || null;
      this.seriesService.getPublicityVideo(Number(this.publicityId)).subscribe(res => {
        this.videoList = res;
        if (!!res.length) {
          this.validateForm.get('type').setValue(
            this.videoList[0].material_type === null ? '' : this.videoList[0].material_type);
        }
      });
      // this.validateForm.get('nickname').setValue(this.filterList[0].program.nickname);
      // if (this.filterList[0].program.nickname === null ) {
      //   this.filterList[0].program.nickname = '';
      // }

      if (this.filterList[0].program) {

        this.validateForm.get('program_type').setValue(
          this.filterList[0].program.program_type === null ? '' : this.filterList[0].program.program_type);
        this.validateForm.get('theme').setValue(
          this.filterList[0].program.theme === null ? '' : this.filterList[0].program.theme);
        this.validateForm.get('episode').setValue(
          this.filterList[0].program.episode === null ? '' : this.filterList[0].program.episode);
        this.validateForm.get('protagonist').setValue(
          this.filterList[0].program.protagonist === null ? '' : this.filterList[0].program.protagonist);
        this.validateForm.get('director').setValue(
          this.filterList[0].program.director === null ? '' : this.filterList[0].program.director);
        this.validateForm.get('screen_writer').setValue(
          this.filterList[0].program.screen_writer === null ? '' : this.filterList[0].program.screen_writer);
        this.validateForm.get('supervisor').setValue(
          this.filterList[0].program.supervisor === null ? '' : this.filterList[0].program.supervisor);
        this.validateForm.get('general_producer').setValue(
          this.filterList[0].program.general_producer === null ? '' : this.filterList[0].program.general_producer);
        this.validateForm.get('producer').setValue(
          this.filterList[0].program.producer === null ? '' : this.filterList[0].program.producer);
        this.validateForm.get('product_company').setValue(
          this.filterList[0].program.product_company === null ? '' : this.filterList[0].program.product_company);
        this.validateForm.get('progress').setValue(
          this.filterList[0].program.progress === null ? '' : this.filterList[0].program.progress);
        this.validateForm.get('introduction').setValue(
          this.filterList[0].program.introduction === null ? '' : this.filterList[0].program.introduction);
        this.validateForm.disable();
        this.uploadVideo = true;
      }
    }
  }
}
