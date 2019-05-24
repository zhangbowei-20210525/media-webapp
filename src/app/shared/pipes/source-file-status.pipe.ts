import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sourceFileStatus'
})
export class SourceFileStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'active':
        return '已就绪';
      case 'backend':
        return '加速备份中';
      case 'deleting':
        return '删除中';
      case 'deleted':
        return '已删除';
      default:
        return value;
    }
  }

}
