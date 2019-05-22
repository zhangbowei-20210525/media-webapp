import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { TransmitService } from './transmit.service';
import { ACLAbility } from '@core/acl';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'app-transmit',
  templateUrl: './transmit.component.html',
  styleUrls: ['./transmit.component.less']
})
export class TransmitComponent implements OnInit {

  select: string;

  content: any;

  constructor(
    public ability: ACLAbility,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private translate: TranslateService,
    private seriesService: TransmitService,
    private acl: ACLService
  ) {
    console.log(this.router.url);
    if (this.router.url.endsWith('transmit')) {
      if (this.acl.canAbility([this.ability.program.source.upload])) {
        this.router.navigate([this.router.url + '/declared']);
      } else if (this.acl.canAbility([this.ability.program.source.download])) {
        this.router.navigate([this.router.url + '/type']);
      }
    }
  }

  ngOnInit() {
  }

  search() {
    this.router.navigate([this.router.url, { search: this.content }]);
  }
}
