import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ceil'
})
export class CeilPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let num = +value;
    if (num === undefined) {
      return 0;
    }
    num = Math.ceil(num);
    return num;
  }

}
