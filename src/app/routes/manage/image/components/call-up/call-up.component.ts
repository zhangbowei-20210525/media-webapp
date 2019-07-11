import { Component, OnInit, Inject } from '@angular/core';
import { SeriesService } from '../../../series/series.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@shared';
import { SettingsService } from '@core';

@Component({
  selector: 'app-call-up',
  templateUrl: './call-up.component.html',
  styleUrls: ['./call-up.component.less']
})
export class CallUpComponent implements OnInit {
  isShow = false;
  isCollection = false;
  SolicitationForm: FormGroup;
  program_type: any;
  program_theme: any;
  description: any;
  getCollectionData: any;
  programTypeList = [];
  themeList = [];

  constructor(
    private seriesService: SeriesService,
    private fb: FormBuilder,
    private message: MessageService,
    private settings: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private token: ITokenService,

  ) { }

  ngOnInit() {
    this.SolicitationForm = this.fb.group({
      companyName: [this.settings.user.company_name],
      userName: [this.settings.user.username],
      filmType: [null, [Validators.required]],
      meterial: [null, [Validators.required]],
      intro: [null],
    });
    this.SolicitationForm.get('companyName').disable();
    this.SolicitationForm.get('userName').disable();
    this.seriesService.programType().subscribe(res => {
      console.log(res);
      this.programTypeList = res.program_type_choices;
      this.themeList = res.theme_choices;
      console.log(this.themeList);
    });
  }

  // 样片征集令生成
  collection() {
    const custom = this.SolicitationForm.value;
    console.log(custom);
    this.description = custom.intro;
    this.program_theme = custom.meterial;
    this.program_type = custom.filmType;

    if (!this.program_theme || this.program_type === null ) {
      console.log(1);
      this.message.error('请填写相关信息');
    } else {
      console.log(2);
      this.seriesService.getSampleCollection(this.program_type, this.program_theme, this.description).subscribe(res => {
        this.isCollection = true;
        this.getCollectionData = res;
        this.SolicitationForm.get('filmType').disable();
        this.SolicitationForm.get('meterial').disable();
        this.SolicitationForm.get('intro').disable();
      });
    }
  }

  validationForm(form: FormGroup) {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  validation() {
    return this.validationForm(this.SolicitationForm);
  }
  // 复制
  copy(data) {
    const input = document.getElementById('url') as HTMLInputElement;
    console.log(input);
    // 选中文本
    input.select();
    // input.onselect()
    // 执行浏览器复制命令
    document.execCommand('copy');
    this.message.success('复制成功');
  }
  linkChange(data) {
    console.log(data);
  }
}
