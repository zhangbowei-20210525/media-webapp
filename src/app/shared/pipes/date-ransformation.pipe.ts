import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dr'
})
export class DateRansformationPipe implements PipeTransform {

    transform(value: any, args?: any): any {
            const date = new Date(value);
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            return m + '月' + d + '日';
    }
}
