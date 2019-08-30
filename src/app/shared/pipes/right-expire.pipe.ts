import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 're'
})
export class RightExpirePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    const expireDate = new Date(value);
    const date = new Date();
    const expireYear = expireDate.getFullYear();
    const expireMonth = expireDate.getMonth() + 1;
    const expireDay = expireDate.getDate();
    const nowYear = date.getFullYear();
    const nowMonth = date.getMonth() + 1;
    const nowDay = date.getDate();
    const year = expireYear - nowYear;
    const month = expireMonth - nowMonth;
    const day = expireDay - nowDay;
    const d = Math.ceil((expireDate.getTime() - date.getTime()) / 86400000);
    console.log(d);
    if (month > 0 && year <= 0 && day > 0) {
      return month + '个月后';
    } else if (year > 0 && month > 0) {
      return year + '年后';
    } else {
      return d + '天后';
    }
  }
}
