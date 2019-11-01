import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'iti'
})
export class IsTimeIntervalPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const date = new Date();
        const oldDate = new Date(value);
        const kpTimec = Math.floor((date.getTime() - oldDate.getTime()) / 1000);
        return kpTimec;
    }

}
