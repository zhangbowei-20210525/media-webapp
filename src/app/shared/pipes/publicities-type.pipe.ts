import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pty'
})
export class PublicitiesTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value === 'sample') {
            return '样片';
        }
        if (value === 'feature') {
            return '片花';
        }
        if (value === 'trailer') {
            return '先导片';
        }
        if (value === 'poster') {
            return '海报';
        }
        if (value === 'still') {
            return '剧照';
        }
        if (value === 'pdf') {
            return 'PDF';
        }
    }
}
