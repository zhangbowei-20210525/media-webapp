import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '@shared/util';

@Pipe({
    name: 'snc'
})
export class ChoreographySncPipe implements PipeTransform {

    transform(date: any, info: any): any {
        if (info !== undefined) {
            const a = info.events.find(f => Util.dateToString(date) === f.broadcast_date);
            const arr = [];
            arr.push(a);
            const names = [];
            arr.forEach(f => {
                names.push(f.program_name);
            });

        const b = info.events.indexOf(info.events.find(f => Util.dateToString(date) === f.broadcast_date));
        const oldArr = [];
        oldArr.push(info.events[b - 1]);
        const oldNames = [];
        oldArr.forEach(f => {
            oldNames.push(f.program_name);
        });
        if (oldNames.indexOf(names[names.length - 1]) === -1) {
            return  names[names.length - 1];
        } else {
            return '';
        }
        }
    }
}
