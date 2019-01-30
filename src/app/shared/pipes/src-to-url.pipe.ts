import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'srcToUrl'
})
export class SrcToUrlPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return `url(${value})`;
  }

}
