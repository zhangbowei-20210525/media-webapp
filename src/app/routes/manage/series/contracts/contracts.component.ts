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

  constructor(

  ) { }

  ngOnInit() {

  }

}
