import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'weekDay'
})
export class WeekDayPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let weekDay;
        switch (new Date(value).getDay()) {
            case 0:
                weekDay = '星期一';
                break;
            case 1:
                weekDay = '星期二';
                break;
            case 2:
                weekDay = '星期三';
                break;
            case 3:
                weekDay = '星期四';
                break;
            case 4:
                weekDay = '星期五';
                break;
            case 5:
                weekDay = '星期六';
                break;
            case 6:
                weekDay = '星期日';
                break;
        }
        return weekDay;
    }

}
