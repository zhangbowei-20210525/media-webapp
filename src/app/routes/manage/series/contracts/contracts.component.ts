import { Component, OnInit } from '@angular/core';
import { PaginationDto } from '@shared';
import { ContractsService } from './contracts.service';
import { finalize, tap, map } from 'rxjs/operators';
import { fadeIn } from '@shared/animations';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd';
import { indexMap } from '@shared/rxjs/operators';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.less'],
  animations: [fadeIn]
})
export class ContractsComponent implements OnInit {

  pagination = { page: 1, page_size: 10 } as PaginationDto;
  dataSet = [];
  isLoaded = false;
  isLoading = false;

  constructor(
    private service: ContractsService,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.fetchContracts();
  }

  fetchContracts() {
    this.isLoading = true;
    this.service.getContractsMock(this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
        console.log(this.isLoaded);
      }), indexMap())
      .subscribe(result => {
        console.log(result);
        this.dataSet = result.list;
        this.pagination = result.pagination;
      });
  }

  pageChange (page: number) {
    this.pagination.page = page;
    this.fetchContracts();
  }

  delete(id: number) {
    this.service.deleteContract(id).subscribe(() => {
      this.message.success(this.translate.instant('global.delete-success'));
    });
  }

}
