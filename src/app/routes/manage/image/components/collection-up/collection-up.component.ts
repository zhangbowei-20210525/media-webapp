import { Component, OnInit, Input } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-collection-up',
  templateUrl: './collection-up.component.html',
  styleUrls: ['./collection-up.component.less']
})
export class CollectionUpComponent implements OnInit {
  @Input() id: number;
  constructor(
    private component: NzModalRef,

  ) { }

  ngOnInit() {

  }
  cancel() {
    this.component.close();
  }
}
