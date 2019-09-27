import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IpManagementService } from '../ip-management.service';
import { MessageService } from '@shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.less']
})
export class ContractDetailsComponent implements OnInit {

  condInfo: any;
  dataSet = [];
  cid: number;

  constructor(
    private service: IpManagementService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.cid = +params.get('id');
      this.service.getContractDetailsInfo(this.cid).subscribe(res => {
        this.condInfo = res;
        this.dataSet = this.mapCopyrights(res.contract_programs);
      });
    });
  }

  mapCopyrights(list: any[]) {
    console.log(list);
    const rights = [];
    list.forEach(item => {
      let index = 0;
      item.rights.forEach(right => {
        rights.push({
          index: index++,
          pid: item.program.id,
          rid: right.id,
          project: item.program.name,
          type: item.program.category,
          right_remark: right.right_remark,
          author: item.program.author,
          right: right.right_type,
          area: right.area_label,
          term: right.start_date && right.end_date,
          termIsPermanent: right.permanent_date,
          termStartDate: right.start_date,
          termEndDate: right.end_date,
          termNote: right.date_remark,
          count: item.rights.length
        });
      });
    });
    return rights;
  }
}
