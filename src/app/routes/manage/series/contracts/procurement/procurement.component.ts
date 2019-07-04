import { Component, OnInit } from '@angular/core';
import { PaginationDto } from '@shared';
import { ContractsService } from '../contracts.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { indexMap } from '@shared/rxjs/operators';
import { fadeIn } from '@shared/animations';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-procurement',
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.less'],
  animations: [fadeIn]
})
export class ProcurementComponent implements OnInit {

  pagination = { page: 1, page_size: 10 } as PaginationDto;
  dataSet = [];
  isLoaded = false;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private service: ContractsService,
    private message: NzMessageService,
    private translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.route.url.subscribe(url => {
    //   console.log(url);
    // });
    this.fetchContracts();
  }

  fetchContracts() {
    this.isLoading = true;
    this.service.getProcurementContracts(this.pagination)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
      }), indexMap())
      .subscribe(result => {
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
      this.fetchContracts();
    });
  }

  contractDetails(id: number) {
    this.router.navigate([`/manage/series/cd/${id}`]);
  }

}
