import { Component, OnInit, Input } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-tendency-info',
  templateUrl: './tendency-info.component.html',
  styleUrls: ['./tendency-info.component.less']
})
export class TendencyInfoComponent implements OnInit {
  @Input() id: number;
  isloading = true;
  source_data: 'onlineSave' | 'localSave' = 'localSave';
  checkedArrayIds = [];
  checkedIds: string;
  // id: any;
  constructor(
    private component: NzModalRef,

  ) { }

  ngOnInit() {

  }
   // 多选框
   checkChangeData(value: any, index: number) {
    const object = {
      value: value[0],
      index: index
    };
    let array = [];
    if (value[0] === undefined) {
      this.checkedArrayIds.splice(this.checkedArrayIds.indexOf(object[index]), 1, ...value);
    } else {
      this.checkedArrayIds.push(object);
    }
    this.checkedArrayIds.forEach(item => {
      array.push(item.value);
    });
    array = Array.from(new Set(array));
    this.checkedIds = array.join(',');
  }
  onSourceTypeChange() {
    // console.log(this.source_data);
  }
  cancel() {
    this.component.close();
  }
}
