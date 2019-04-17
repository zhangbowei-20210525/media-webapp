import { DatePipe } from '@angular/common';

export class Util {
  static pipe = new DatePipe('zh-CN');
  static dateToString(value: Date, format: string = 'yyyy-MM-dd') {
    return this.pipe.transform(value, format);
  }
}
