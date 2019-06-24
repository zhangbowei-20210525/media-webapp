import { Component, OnInit } from '@angular/core';
import { PaginationDto, MessageService, TreeService, Util } from '@shared';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CopyrightsService } from './copyrights.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeIn } from '@shared/animations';
import { finalize, switchMap, delay } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { NzTreeNodeOptions, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SeriesService } from '../series.service';
import { RootTemplateDto } from './dtos';
import { RelationImportFieldComponent } from '../components/relation-import-field/relation-import-field.component';
import { ACLService } from '@delon/acl';
import { ACLAbility } from '@core/acl';

@Component({
  selector: 'app-copyrights',
  templateUrl: './copyrights.component.html',
  animations: [fadeIn]
})
export class CopyrightsComponent implements OnInit {

  constructor(
    private service: CopyrightsService,
    private message: NzMessageService,
    private modal: NzModalService,
    private translate: TranslateService,
    private acl: ACLService,
    public ability: ACLAbility
  ) { }

  ngOnInit() {
    console.log('ability', this.ability);
    console.log('data', this.acl.data);
    console.log('can', this.acl.canAbility('right_edit'));
  }

  addPublish() {
    this.service.notify({ type: 'navigate', value: 'publish' });
  }

  filter() {
    this.service.notify({ type: 'drawer', value: 'filter' });
  }

}
