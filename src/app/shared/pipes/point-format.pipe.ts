import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pointFormat'
})
export class PointFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let time: string;
    if (value as number) {
      time = this.secondsFormat(value);
    }
    return time;
  }

  private secondsFormat(point: number): string {
    let minutes = 0;
    let seconds = 0;
    minutes = Math.floor(point / 60);
    seconds = point % 60;
    const minutesString = minutes.toString().length > 1 ? minutes : '0' + minutes;
    const secondsString = seconds.toString().length > 1 ? seconds : '0' + seconds;
    const time = `${minutesString}:${secondsString}`;
    return time;
  }

}
