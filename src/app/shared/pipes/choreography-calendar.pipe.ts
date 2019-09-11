import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '@shared';

@Pipe({
    name: 'cc'
})
export class ChoreographyCalendarPipe implements PipeTransform {

    transform(date: any, info: any): any {
        if (info !== undefined) {
            if (info.events.some(f => Util.dateToString(date) === f.broadcast_date)) {
                const a = info.events.indexOf(info.events.find(f => Util.dateToString(date) === f.broadcast_date));
                if (a > 0) {
                    const n = new Date(info.events[a].broadcast_date).getTime() - 86400000;
                    const lastn = info.events[a - 1].broadcast_date;
                    const d = new Date(n);
                    if (Util.dateToString(d) === lastn) {
                        return 2;
                    } else {
                        return 1;
                    }
                } else if (a === 0) {
                    return 1;
                } else {
                    return 0;
                }
            }
            return 0;
        }
    }
}
