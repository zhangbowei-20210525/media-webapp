import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteFormat'
})
export class ByteFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let bytes = +value;
    if (bytes === undefined) {
      bytes = 0;
    }
    return this.bytesToSize(bytes);
  }

  private bytesToSize(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(4) + ' ' + sizes[i]; // toPrecision(4) 指数计数法，总是保持4位，少于4位补小数0
  }

}
