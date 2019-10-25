import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dr1'
})
export class DateRansformation1Pipe implements PipeTransform {

    transform(value: any, args?: any): any {
            const date = new Date(value);
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const d = date.getDate();
            return  y + '/' + m + '/' + d;
    }
}
