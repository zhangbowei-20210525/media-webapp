import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaginationDto } from '@shared';
import { ContractsService } from './contracts.service';
import { finalize, tap, map, filter } from 'rxjs/operators';
import { fadeIn } from '@shared/animations';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { indexMap } from '@shared/rxjs/operators';
import { CopyrightsService } from '../copyrights/copyrights.service';
import { RelationImportFieldComponent } from '../components/relation-import-field/relation-import-field.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ACLAbility } from '@core/acl';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.less'],
  animations: [fadeIn]
})
export class ContractsComponent implements OnInit, OnDestroy {

  isUploading = false;
  loadingRef: any;
  fileName: string;
  lastUrlType: 'purchase' | 'publish';
  purchaseTemplatePath: string;
  publishTemplatePath: string;

  private eventsSubscription: Subscription;

  constructor(
    public ability: ACLAbility,
    private route: ActivatedRoute,
    private router: Router,
    private service: ContractsService,
    private message: NzMessageService,
    private modal: NzModalService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.route.firstChild.url.subscribe(url => {
      if (url[url.length - 1].path === 'procurement') {
        this.lastUrlType = 'purchase';
      } else if (url[url.length - 1].path === 'published') {
        this.lastUrlType = 'publish';
      } else {
        throw new Error('Unexpected URL');
      }
    });
    this.eventsSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.url.endsWith('procurement')) {
        this.lastUrlType = 'purchase';
      } else if (event.url.endsWith('published')) {
        this.lastUrlType = 'publish';
      } else {
        throw new Error('Unexpected URL');
      }
    });
    this.service.getImportTemplateFilePath('purchase').subscribe(result => {
      this.purchaseTemplatePath = result.file_url;
    });
    this.service.getImportTemplateFilePath('publish').subscribe(result => {
      this.publishTemplatePath = result.file_url;
    });
  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }

  fileChange(event: Event) {
    console.log('343');
    const contractType = this.lastUrlType;
    const input = event.target as HTMLInputElement;
    const file = input.files.item(0);
    this.loadingRef = this.message.loading('正在上传文件');
    this.isUploading = true;
    this.service.uploadFile(file)
      .pipe(finalize(() => {
        this.isUploading = false;
      }))
      .subscribe(result => {
        this.fileName = result.file_name;
        this.choiceFields(result.file_name, contractType);
      }, error => {
        this.message.remove(this.loadingRef.messageId);
      });
    input.value = null;
  }

  choiceFields(name: string, contractType: string) {
    this.service.getChoiceFields(name, contractType)
      .pipe(finalize(() => {
        this.message.remove(this.loadingRef.messageId);
      }))
      .subscribe(result => {
        result.program_type.forEach(item => {
          item.count = 0;
        });
        this.message.success('上传成功');
        this.modal.create({
          nzTitle: '关联字段',
          nzContent: RelationImportFieldComponent,
          nzComponentParams: { programThemes: result.theme, programTypes: result.program_type },
          nzMaskClosable: false,
          nzOnOk: (component: RelationImportFieldComponent) => this.relationImportFieldAgreed(component, contractType)
        });
      });
  }

  relationImportFieldAgreed = (component: RelationImportFieldComponent, contractType: string) => new Promise((resolve, reject) => {
    const loadingRef = this.message.loading('正在导入权利');
    this.service.importContracts(this.fileName, contractType, component.programTypes, component.programThemes)
      .pipe(finalize(() => {
        this.message.remove(loadingRef.messageId);
      }))
      .subscribe(result => {
        this.message.success(`导入成功，合同 ${result.contract_count} 项，权利 ${result.program_count} 项`);
        resolve();
      }, error => {
        reject(false);
      });
  })

}
