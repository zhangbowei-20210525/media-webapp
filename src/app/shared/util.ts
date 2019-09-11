import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { environment } from '@env/environment';

type MaterielType = 'sample' | 'feature' | 'trailer' | 'poster' | 'still' | 'pdf';
type MediaType = 'video' | 'image' | 'doc';
type UploadFileType = 'common' | MediaType | string;

export class Util {

  static readonly pipe = new DatePipe('zh-CN');
  static readonly uploadUrls = {
    'video': `${environment.fileServer}/api/upload/video`,
    'image': `${environment.fileServer}/api/upload/image`,
    'doc': `${environment.fileServer}/api/upload/document`,
    'common': `${environment.fileServer}/api/upload/common`
  };

  static dateToString(value: Date, format: string = 'yyyy-MM-dd') {
    return this.pipe.transform(value, format);
  }
  static dateFullToString(value: Date, format: string = 'yyyy-MM-dd HH:mm:ss') {
    return this.pipe.transform(value, format);
  }

  static weekDay(value: string) {
    return this.pipe.transform(new Date(value).getDay());
  }

  static validationForm(form: FormGroup) {
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  static getMediaType(materielType: MaterielType | string): MediaType {
    switch (materielType) {
      case 'sample':
      case 'feature':
      case 'trailer':
        return 'video';
      case 'poster':
      case 'still':
        return 'image';
      case 'pdf':
        return 'doc';
    }
  }

  static getUploadUrl(fileType: UploadFileType) {
    return Util.uploadUrls[fileType];
  }

  static getUploadUrlByMaterielType(materielType: MaterielType | string) {
    return Util.uploadUrls[Util.getMediaType(materielType)];
  }
}
