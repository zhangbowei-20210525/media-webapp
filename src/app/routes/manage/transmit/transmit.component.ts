import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { TransmitService } from './transmit.service';

@Component({
  selector: 'app-transmit',
  templateUrl: './transmit.component.html',
  styleUrls: ['./transmit.component.less']
})
export class TransmitComponent implements OnInit {

  select: string;

  content: any;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private translate: TranslateService,
    private seriesService: TransmitService,
  ) { }

  ngOnInit() {
  }

  search() {
    this.router.navigate([this.router.url, { search: this.content }]);
  }
}
