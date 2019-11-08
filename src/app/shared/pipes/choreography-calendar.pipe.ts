import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '@shared/util';

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
                    const m = new Date(info.events[a].broadcast_date);
                    if (Util.dateToString(d) === lastn) {
                        if (m.getDay() === 1) {
                            return 1;
                        } else {
                            const c = info.events.find(f => Util.dateToString(date) === f.broadcast_date);
                            const arr = [];
                            arr.push(c);
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
                                return 3;
                            } else {
                                return 2;
                            }
                        }
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
