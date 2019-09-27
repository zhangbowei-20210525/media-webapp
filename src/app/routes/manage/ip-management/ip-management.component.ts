import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaginationDto, MessageService, TreeService, Util } from '@shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IpManagementService } from './ip-management.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RootTemplateDto } from './dtos';
import { NzTreeNodeOptions } from 'ng-zorro-antd';
import { fadeIn } from '@shared/animations';

@Component({
  selector: 'app-ip-management',
  templateUrl: './ip-management.component.html',
  animations: [fadeIn]
})
export class IpManagementComponent implements OnInit {

  drawerVisible = false;
  isLoaded = false;
  isLoading = false;
  dataSet = [];
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  filtrateForm: FormGroup;
  areaOptions: any[] = [];
  rightOptions: any[] = [];
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  content: string;

  rightTypeOption = ['改编权', '著作权'];

  constructor(
    private service: IpManagementService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ts: TreeService,
  ) { }

  ngOnInit() {
    this.filtrateForm = this.fb.group({
      type: [null],
      rightType: [null],
      area: [[null]],
      date: [null],
    });
    this.filtrate();
    this.loadAreaOptions();
    this.loadRightsOptions();
  }

  fetchCopyrights(params: any) {
    this.isLoading = true;
    this.service.getIpRight(this.pagination, params)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
      }))
      .subscribe(result => {
        this.dataSet = this.mapCopyrights(result.list);
        this.pagination = result.pagination;
      });
  }

  filter() {
    this.drawerVisible = true;
  }

  search() {
    this.pagination.page = 1;
    this.filtrate();
  }


  getStatisticsSelectArea(origins: RootTemplateDto[]): NzTreeNodeOptions[] {
    return this.ts.getNzTreeNodes(origins, item => ({
      title: item.name,
      key: item.code,
      isLeaf: !!item.children && item.children.length < 1,
      selectable: true,
      expanded: true,
      disableCheckbox: false,
      checked: false,
      disabled: item.disabled
    }));
  }

  addCopyrights() {
    this.router.navigate([`/manage/series/add-copyrights`]);
  }

  loadAreaOptions() {
    this.service.getCopyrightAreaOptions().subscribe(result => {
      this.areaOptions = this.getStatisticsSelectArea(result);
    });
  }

  loadRightsOptions() {
    // this.service.getCopyrightTemplates().subscribe(result => {
    //   if (result) {
    //     result = [{ code: null, name: '所有' }, ...result];
    //     this.service.setLeafNode(result);
    //   }
    //   this.rightOptions = result;
    // });
  }

  mapCopyrights(list: any[]) { // 可考虑使用公共方法
    const rights = [];
    let itemIndex = 1;
    list.forEach(item => {
      let index = 0;
      item.rights.forEach(right => {
        rights.push({
          index: index++,
          itemIndex: itemIndex + (this.pagination.page - 1) * this.pagination.page_size,
          pid: item.id,
          rid: right.id,
          project: item.name,
          type: item.category,
          right_remark: right.right_remark,
          author: item.author,
          right: right.right_type_label,
          area: right.area_label,
          term: right.start_date && right.end_date,
          termIsPermanent: right.permanent_date,
          termStartDate: right.start_date,
          termEndDate: right.end_date,
          termNote: right.date_remark,
          count: item.rights.length
        });
      });
      itemIndex++;
    });
    return rights;
  }

  copyrightsPageChange(page: number) {
    this.pagination.page = page;
    this.filtrate();
  }

  filtrate() {
    const type = this.filtrateForm.value['type'];
    const rightType = this.filtrateForm.value['rightType'];
    const area = this.filtrateForm.value['area'] as string[];
    const trem = this.filtrateForm.value['date'] as Date[];
    if (area && area.length > 0) {
      area.forEach((item, index) => {
        if (!item) {
          area[index] = '';
        }
      });
    }
    const params = {
      type: type || '',
      area_number: area ? area : '',
      right_type: rightType ? rightType : '',
      start_date: trem && trem.length > 0 ? Util.dateToString(trem[0]) : '',
      end_date: trem && trem.length > 0 ? Util.dateToString(trem[1]) : '',
      q: this.content ? this.content : ''
    };
    this.fetchCopyrights(params);
  }

  deleteSeriesCopyright(pid: number, i: number) {
    this.service.deleteCopyrights(pid).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      if (this.pagination.pages === this.pagination.page) {
        if (this.pagination.page === 1) { } else {
          if (i === 0) {
            this.pagination.page = this.pagination.page - 1;
          }
        }
      }
      this.filtrate();
    });
  }

  onFormValueChange() {
    this.pagination.page = 1;
    this.filtrate();
  }

}
