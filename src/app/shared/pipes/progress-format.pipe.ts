import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressFormat'
})
export class ProgressFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let num = +value;
    if (num === undefined) {
      return 0;
    }
    num = num * 100;
    return num;
  }

  // private nzbBytesToSize(bytes: number): string {
  //   if (bytes < 100) {
  //     return this.xxx(bytes);
  //   } else {
  //     return 'percent';
  //   }
  // }

}
