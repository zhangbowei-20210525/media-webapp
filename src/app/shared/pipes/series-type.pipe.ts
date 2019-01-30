import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'seriesType'
})
export class SeriesTypePipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

  transform(value: string, args?: any): any {
    const key = this.switchType(value);
    if (key) {
      return this.translate.instant(key);
    }
    return value;
  }

  switchType(type: string) {
    let translateKey: string;
    switch (type) {
      case 'tv':
        translateKey = 'app.series.tv';
        break;
      case 'film':
        translateKey = 'app.series.film';
        break;
      case 'variety':
        translateKey = 'app.series.variety';
        break;
      case 'other':
        translateKey = 'app.series.other';
        break;
      default:
        translateKey = null;
        break;
    }
    return translateKey;
  }

}
