import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFormat'
})
export class ArrayFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value instanceof Array) {
      return value.join(` ${args || '/'} `);
    }
    return value;
  }

}
