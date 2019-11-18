import { Component, OnInit } from '@angular/core';
import { ContractsService } from '../contracts.service';
import { ActivatedRoute } from '@angular/router';
import { PaginationDto, MessageService } from '@shared';
import { CopyrightsService } from '../../copyrights/copyrights.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.less']
})
export class ContractDetailsComponent implements OnInit {

  condInfo: any;
  dataSet = [];
  conid: number;

  constructor(
    private service: ContractsService,
    private route: ActivatedRoute,
    private copService: CopyrightsService,
    private message: MessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.conid = +params.get('id');
      this.filtrate();
    });
  }

  filtrate() {
    this.service.getContractDetailsInfo(this.conid).subscribe(res => {
      this.condInfo = res;
      this.dataSet = this.mapCopyrights(res.programs);
    });
  }

  mapCopyrights(list: any[]) { // 可考虑使用公共方法
    const rights = [];
    let itemIndex = 0;
    list.forEach(item => {
      let index = 0;
      item.rights.forEach(right => {
        rights.push({
          index: index++,
          itemIndex: itemIndex,
          pid: item.program_id,
          rid: right.id,
          project: item.program_name,
          contract_number: item.contract_number,
          custom_name: item.custom_name,
          share_amount: item.share_amount,
          total_amount: item.total_amount,
          type: item.program_type,
          episode: item.episode,
          right: right.right_type_label,
          area: right.area_label,
          term: right.start_date && right.end_date,
          termIsPermanent: right.permanent_date,
          termStartDate: right.start_date,
          termEndDate: right.end_date,
          termNote: right.date_remark,
          count: item.rights.length,
        });
      });
      itemIndex++;
    });
    return rights;
  }

  deleteSeriesCopyright(pid: number) {
    this.copService.deletePubCopyrights(pid).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.filtrate();
    });
  }
}
