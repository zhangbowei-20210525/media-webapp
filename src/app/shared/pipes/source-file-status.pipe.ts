import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sourceFileStatus'
})
export class SourceFileStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'active':
        return '生效中';
      case 'backend':
        return '加速备份中';
      case 'deleting':
        return '删除中';
      case 'deleted':
        return '已删除';
      case 'pending':
        return '等待中';
      case 'upload':
        return '上传中';
      default:
        return value;
    }
  }

}
