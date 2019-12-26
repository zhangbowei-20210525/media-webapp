import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'includes'
})
export class IncludesPipe implements PipeTransform {

    transform(value: string[], args?: any): any {
        if (!value) { return false; }
        return value.includes(args);
    }

}
