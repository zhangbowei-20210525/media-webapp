import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentFormat'
})
export class PaymentFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (+value) {
      case 1:
        return '一次性';
      case 2:
        return '分二次';
      case 3:
        return '分三次';
      case 4:
        return '分四次';
      default:
        return value;
    }
  }

}
