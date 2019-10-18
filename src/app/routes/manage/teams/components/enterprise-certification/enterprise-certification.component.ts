import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TeamsService } from '../../teams.service';
import { Observable } from 'rxjs';
import { UploadFile } from 'ng-zorro-antd';

@Component({
  selector: 'app-enterprise-certification',
  templateUrl: './enterprise-certification.component.html',
  styleUrls: ['./enterprise-certification.component.less']
})
export class EnterpriseCertificationComponent implements OnInit {

  validateForm: FormGroup;
  show = false;
  confirm = false;
  @Input() info: any;
  @Input() currentCompany: any;


  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(
    private fb: FormBuilder,
    private service: TeamsService,
  ) { }

  /**
     初始化方法：出发弹框立即调用此方法，内容包括初始表单验证，初始化字段赋值。
  */
  ngOnInit() {
    this.validateForm = this.fb.group({
      companyFullName: [null, [Validators.required]],
      companyAbbreviationName: [null, [Validators.required]],
      applicant: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
      introduction: [null],
    });
    if (this.info === null) {
      this.validateForm.get('companyFullName').setValue(this.currentCompany.company_full_name);
      this.validateForm.get('companyAbbreviationName').setValue(this.currentCompany.company_name);
      this.validateForm.get('phone').setValue(this.currentCompany.phone);
      this.validateForm.get('introduction').setValue(this.currentCompany.introduction);
    } else {
      this.validateForm.get('companyFullName').setValue(this.info.full_name);
      this.validateForm.get('companyAbbreviationName').setValue(this.info.name);
      this.validateForm.get('applicant').setValue(this.info.apply_username);
      this.validateForm.get('phone').setValue(this.info.apply_phone);
      this.validateForm.get('introduction').setValue(this.info.introduction);
      this.fileList.push( {
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: this.info.business_license_image
      });
      this.show = false;
      this.confirm = true;
    }
  }

  /**
     上传营业执照之后，点击图片详情操作图标出发此方法，设置营业执照放大后的样式以及图片路径
  */
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  /**
     在teams调用此方法，此方法为验证表单，返回为true时继续执行下一步操作
  */
  validation() {
    const form = this.validateForm;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    this.confirm = true;
    if (this.fileList.length === 0) {
      this.show = true;
    }
    if (this.fileList.length > 0) {
      this.show = false;
    }
    return form.valid;
  }

  /**
     在teams调用此方法，此方法为验证上传营业执照列表，当营业执照至少有一张时返回true，执行下一步操作
  */
  validationFileList() {
    if (this.fileList.length === 0) {
      return false;
    }
    if (this.fileList.length > 0) {
      return true;
    }
  }
/**
     在teams调用此方法，此方法为提交认证信息表单，调用后端提交认证接口，调通后信息提交成功，改变当前公司认证状态
  */
  submit(): Observable<any> {
    const form = this.validateForm;
      const data = {
        full_name: form.value['companyFullName'] || null,
        name: form.value['companyAbbreviationName'] || null,
        apply_username: form.value['applicant'] || null,
        apply_phone: form.value['phone'] || null,
        introduction: form.value['introduction'] || null,
        business_license_image: this.fileList[0].url || this.fileList[0].response.url
      };
        return this.service.addAuthentication(data);
  }

}
