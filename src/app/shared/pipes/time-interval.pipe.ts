import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ti'
})
export class TimeIntervalPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const date = new Date();
        const oldDate = new Date(value);
        const kpTimec = Math.floor((date.getTime() - oldDate.getTime()) / 1000);
        if (kpTimec < 3600) {
            return Math.floor(kpTimec / 60);
        }
        if (kpTimec >= 3600 && kpTimec < 86400) {
            if (oldDate.getHours() < 10) {
                if (oldDate.getMinutes() < 10) {
                    if (oldDate.getSeconds() < 10) {
                        return '0' + oldDate.getHours() + ':' + '0' + oldDate.getMinutes() + ':' + '0' + oldDate.getSeconds();
                    } else {
                        return '0' + oldDate.getHours() + ':' + '0' + oldDate.getMinutes() + ':' + oldDate.getSeconds();
                    }
                } else {
                    return '0' + oldDate.getHours() + ':' + oldDate.getMinutes() + ':' + oldDate.getSeconds();
                }
            } else {
                if (oldDate.getMinutes() < 10) {
                    if (oldDate.getSeconds() < 10) {
                        return oldDate.getHours() + ':' + '0' + oldDate.getMinutes() + ':' + '0' + oldDate.getSeconds();
                    } else {
                        return oldDate.getHours() + ':' + '0' + oldDate.getMinutes() + ':' + oldDate.getSeconds();
                    }
                } else {
                    return oldDate.getHours() + ':' + oldDate.getMinutes() + ':' + oldDate.getSeconds();
                }
            }
        }
        if (kpTimec >= 86400) {
            if (oldDate.getMonth() + 1 < 10) {
                if (oldDate.getDate() < 10) {
                    return oldDate.getFullYear() + '年' + '0' + (oldDate.getMonth() + 1) + '月' + '0' + oldDate.getDate() + '日';
                } else {
                    return oldDate.getFullYear() + '年' + '0' + (oldDate.getMonth() + 1) + '月' + oldDate.getDate() + '日';
                }
            } else {
                if (oldDate.getDate() < 10) {
                    return oldDate.getFullYear() + '年' + (oldDate.getMonth() + 1) + '月' + '0' + oldDate.getDate() + '日';
                } else {
                    return oldDate.getFullYear() + '年' + (oldDate.getMonth() + 1) + '月' + oldDate.getDate() + '日';
                }
            }
        }
    }
}
