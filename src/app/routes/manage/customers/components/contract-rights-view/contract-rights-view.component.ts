import { Component, OnInit, Input } from '@angular/core';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-contract-rights-view',
  templateUrl: './contract-rights-view.component.html',
  styleUrls: ['./contract-rights-view.component.less']
})
export class ContractRightsViewComponent implements OnInit {

  // @Input() id: number;
  @Input() list: any[];

  constructor(
    private service: CustomersService
  ) { }

  ngOnInit() {
    // this.list = [{
    //   program_name: '微微一笑很倾城',
    //   rights: [{
    //     right_type_label: '播映权',
    //     area_label: '中国大陆',
    //     start_date: '2019/01/01',
    //     end_date: '2022/01/01'
    //   }]
    // }];
  }

}
