import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

export class Util {
  static pipe = new DatePipe('zh-CN');
  static dateToString(value: Date, format: string = 'yyyy-MM-dd') {
    return this.pipe.transform(value, format);
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
}
