import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '@shared/util';

@Pipe({
    name: 'sn'
})
export class ChoreographySnPipe implements PipeTransform {

    transform(date: any, info: any): any {
        if (info !== undefined) {
            const a = info.events.find(f => Util.dateToString(date) === f.broadcast_date);
            const arr = [];
            arr.push(a);
            const names = [];
            arr.forEach(f => {
                names.push(f.program_name);
            });
            return  names[names.length - 1];
        }
    }
}
