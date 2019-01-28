import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floor'
})
export class FloorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let num = +value;
    if (num === undefined) {
      return 0;
    }
    num = Math.floor(num);
    return num;
  }

}
