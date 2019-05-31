import { Component, OnInit, Input } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-delete-tape',
  templateUrl: './delete-tape.component.html',
  styleUrls: ['./delete-tape.component.less']
})
export class DeleteTapeComponent implements OnInit {
  @Input() id: number;
  isloading = true;
  source_data: 'onlineSave' | 'localSave' = 'localSave';
  // id: any;
  constructor(
    private component: NzModalRef,

  ) { }

  ngOnInit() {

  }

  onSourceTypeChange() {
    // console.log(this.source_data);
  }
  cancel() {
    this.component.close();
  }
}
