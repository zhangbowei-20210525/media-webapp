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
  }

}
