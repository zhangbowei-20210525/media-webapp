import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'investmentType'
})
export class InvestmentTypePipe implements PipeTransform {

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
      case 'homemade':
        translateKey = 'app.copyright.homemade';
        break;
      case 'purchase':
        translateKey = 'app.copyright.purchase';
        break;
      case 'proxy':
        translateKey = 'app.copyright.proxy';
        break;
      case 'main-vote':
        translateKey = 'app.copyright.main-vote';
        break;
      case 'follow':
        translateKey = 'app.copyright.follow';
        break;
      case 'co-production':
        translateKey = 'app.copyright.co-production';
        break;
      case 'contract':
        translateKey = 'app.copyright.contract';
        break;
      case 'introduction':
        translateKey = 'app.copyright.introduction';
        break;
      default:
        translateKey = null;
        break;
    }
    return translateKey;
  }

}
