import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'includes'
})
export class IncludesPipe implements PipeTransform {

    transform(value: string[], args?: any): any {
        if (!value) { return false; }
        console.log('0000000000');
        console.log(value.includes(args));
        return value.includes(args);
    }

}
