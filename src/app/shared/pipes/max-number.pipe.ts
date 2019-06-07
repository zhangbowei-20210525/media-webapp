import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxNumber'
})
export class MaxNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const max = +args || 99;
    return value > max ? `${max}+` : value;
  }

}
