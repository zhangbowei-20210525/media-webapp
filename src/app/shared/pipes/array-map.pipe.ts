import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayMap'
})
export class ArrayMapPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value instanceof Array) {
      return this.map(value, args);
    }
    return value;
  }

  map(array: any[], key: string) {
    return array.map(item => item[key]);
  }

}
