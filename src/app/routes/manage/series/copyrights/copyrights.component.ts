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

@Component({
  selector: 'app-copyrights',
  templateUrl: './copyrights.component.html',
  animations: [fadeIn]
})
export class CopyrightsComponent implements OnInit {

  isUploading = false;

  constructor(
    private service: CopyrightsService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit() {

  }

  fileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files.item(0);
    const loadingRef = this.message.loading('正在上传文件');
    this.isUploading = true;
    this.service.uploadImportFileMock(file)
    .pipe(finalize(() => {
      this.message.remove(loadingRef.messageId);
      this.isUploading = false;
    }))
    .subscribe(result => {
      this.message.success('上传成功');
      this.modal.create({
        nzTitle: '关联字段',
        nzContent: RelationImportFieldComponent,
        nzComponentParams: { theme: result.theme, programType: result.program_type }
      });
    });
    input.value = null;
  }
}
