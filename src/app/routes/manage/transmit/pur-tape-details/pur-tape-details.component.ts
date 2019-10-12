import { Component, OnInit } from '@angular/core';
import { TransmitService } from '../transmit.service';
import { ActivatedRoute } from '@angular/router';
import { PaginationDto } from '@shared';

@Component({
  selector: 'app-pur-tape-details',
  templateUrl: './pur-tape-details.component.html',
  styleUrls: ['./pur-tape-details.component.less']
})
export class PurTapeDetailsComponent implements OnInit {

  dataSet = [];
  id: number;
  info: any;
  tapeFilePagination = { page: 1, count: 10, page_size: 10 } as PaginationDto;

  constructor(
    private service: TransmitService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
        this.id = +params.get('id');
        this.service.getPurTapeInfo(this.id).subscribe(res => {
           this.info = res;
        });
        this.service.getPurTapeFile(this.id, this.tapeFilePagination).subscribe(res => {
          this.dataSet = res.list;
          this.tapeFilePagination = res.pagination;
        });
    });
  }

  tapeFilePageChange(page: number) {
    this.tapeFilePagination.page = page;
    this.service.getPurTapeFile(this.id, this.tapeFilePagination).subscribe(res => {
      this.dataSet = res.list;
      this.tapeFilePagination = res.pagination;
    });
  }

}
