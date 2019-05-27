import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { AddTheatreComponent } from './components/add-theatre/add-theatre.component';

@Component({
  selector: 'app-choreography',
  templateUrl: './choreography.component.html',
  styleUrls: ['./choreography.component.less']
})
export class ChoreographyComponent implements OnInit {

  constructor(
    private modal: NzModalService,
  ) { }

  ngOnInit() {
  }

  addTheatre () {
    this.modal.create({
      nzTitle: '新增节目',
      nzContent: AddTheatreComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: 800,
      nzOnOk: this.addTheatreAgreed
    });
  }


  addTheatreAgreed = (component: AddTheatreComponent) => new Promise((resolve, reject) => {
    // if (component.validation()) {
    //   component.submit().subscribe(res => {
    //     this.message.success(this.translate.instant('global.add-success'));
    //     this.refreshDataSet();
    //     resolve();
    //   }, error => {
    //     reject(false);
    //   });
    // } else {
    //   reject(false);
    // }
  })

}
