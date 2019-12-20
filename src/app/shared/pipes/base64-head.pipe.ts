import { Pipe, PipeTransform } from '@angular/core';

const typeList = {
    'jpeg': 'image/jpeg',
    'png': 'image/png'
};

@Pipe({
    name: 'base64'
})
export class Base64HeadPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return this.base64Head(value, args);
    }

    base64Head(base64Data: string, type: string) {
        return `data:${typeList[type]};base64,` + base64Data;
      }
}
