import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzNotificationService, NzModalService, UploadChangeParam } from 'ng-zorro-antd';
import { PaginationDto, MessageService, Util } from '@shared';
import { SeriesService } from '../../series/series.service';
import { PublicityService } from '../../series/details/publicity/publicity.service';
import { QueueUploader } from '@shared/upload';
import { filter } from 'rxjs/operators';
import { CollectionUpComponent } from '../components/collection-up/collection-up.component';
import { switchMap, tap, map, finalize, } from 'rxjs/operators';
import { environment } from '@env/environment';


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
  mediaType: string;
  uploadUrl: string;
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
  isShowBtn = false;
  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private message: MessageService,
    private seriesService: SeriesService,
    private router: Router,
    private modalService: NzModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.files = [];
    this.videoList = [];
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
  fileType(value: string) {
    this.mediaType = Util.getMediaType(value as any);
    this.uploadUrl = Util.getUploadUrl(this.mediaType as any);
  }

  beforeUpload = (file: any, fileList: any[]) => {
    const list = [] as any[];
    const filters = { 'video': this.fileFilters, 'image': this.imageFilters, 'doc': this.pdfFilters }[this.mediaType] as string[];
    for (const key in fileList) {
      if (fileList.hasOwnProperty(key)) {
        const element = fileList[key];
        if (filters.some(f => element.name.toLowerCase().endsWith(f))) {
          list.push(element);
        }
      }
    }
    if (list.length < 1) {
      this.message.error('????????????');
      return false;
    } else {
      return true;
    }
  }

  handleChange(param: UploadChangeParam): void {
    console.log(param, 'param');
    this.isShowBtn = true;
    this.files = param.fileList;
    console.log(this.files);
    this.size = param.file.size / 1000000;
    this.status = param.file.status;
    this.type = param.file.type.split('/')[1];
    this.files.forEach((item, index) => {
      // console.log(item);
      if (item.status === 'error') {
        this.files = this.files.splice(index, 1);
        this.statusType = 'exception';
      } else {
        this.statusType = '';
      }
      // (item as any).percent = String(item.percent).split('.')[0];
      item.percent = Math.floor(item.percent);
      // console.log(fileList);
    });

    if (this.validateForm.value.type === 'feature'
      || this.validateForm.value.type === 'sample'
      || this.validateForm.value.type === 'trailer') {
      if (this.size > '3072' && this.status === 'done') {
        this.notification.error('??????????????????', `??????????????????????????????`);
      } else if (this.status === 'done') {
        this.notification.success('??????????????????', `?????? ${param.file.name} ???????????????`);
        this.isShowBtn = false;
      } else if (this.status === 'error') {
        this.notification.error('??????????????????', `?????? ${param.file.name} ???????????????`);
      }

    }
    if (this.validateForm.value.type === 'poster' || this.validateForm.value.type === 'still') {
      if (this.size > '2' && this.status === 'done') {
        this.notification.error('??????????????????', `??????????????????????????????`);
      } else if (this.status === 'done') {
        this.notification.success('??????????????????', `?????? ${param.file.name} ???????????????`);
        this.isShowBtn = false;
      } else if (this.status === 'error') {
        this.notification.error('??????????????????', `?????? ${param.file.name} ???????????????`);
      }
    }
    if (this.validateForm.value.type === 'pdf') {
      if (this.size > '2' && this.status === 'done') {
        this.notification.error('??????????????????', `????????????????????????pdf??????`);
      } else if (this.status === 'done') {
        this.notification.success('??????????????????', `?????? ${param.file.name} ???????????????`);
        this.isShowBtn = false;
      } else if (this.status === 'error') {
        this.notification.error('??????????????????', `?????? ${param.file.name} ???????????????`);
      }
    }
    param.fileList.forEach((b, index) => {
      if (!!b.response) {
        // this.id = b.response.id ;
        this.extension = b.response.extension;
        this.filename = b.response.filename;
        this.name = b.response.name;
        this.size = b.response.size;
      }
    });
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
    if (this.filterList.length > 0) {
      this.submitConent();
    } else {
      if (this.validation()) {
        this.submitConent();
      }
    }
    if (this.videoList.length > 0) {
      this.submitConent();
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
      obj.name = item.response.name;
      obj.filename = item.response.filename;
      obj.extension = item.response.extension;
      obj.size = item.response.size;
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
      this.message.error('?????????????????????');
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
          nzOkText: '???????????????',
          nzCancelText: '???????????????',
          nzOnCancel: () => new Promise((resolve) => {
            resolve();
            this.router.navigate([`/manage/image/details-solicitation/${this.id}`]);
            window.location.reload();
            this.validateForm.reset();
            this.validateForm.enable();
            this.uploadVideo = false;
            this.validateForm = this.validateForm;
            this.videoList = [];
            // console.log(this.videoList, 'video');
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
    // this.getDisplayDate();
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
      console.log(this.filterList[0].program);
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
        this.getDisplayDate();

      }
    }
  }
}
