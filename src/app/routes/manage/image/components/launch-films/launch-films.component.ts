import { Component, OnInit, Input } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-launch-films',
  templateUrl: './launch-films.component.html',
  styleUrls: ['./launch-films.component.less']
})
export class LaunchFilmsComponent implements OnInit {
  @Input() id: number;
  @Input() intentonName = [];
  source_data: 'firstInstance' | 'SecondInstance' = 'firstInstance';
  constructor(
    private component: NzModalRef,
  ) { }

  ngOnInit() {
    console.log(this.intentonName);
  }

  launchFilmsProcess() {
    console.log(this.source_data);
  }
  cancel() {
    this.component.close();
  }
}
