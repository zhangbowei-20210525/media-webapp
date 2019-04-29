import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyDefaultChar'
})
export class DefaultCharPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value != null && value !== undefined) {
      return value;
    }
    return '-';
  }

}
