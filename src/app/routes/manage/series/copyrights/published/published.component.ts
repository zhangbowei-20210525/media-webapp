import { Component, OnInit } from '@angular/core';
import { PaginationDto, MessageService, TreeService } from '@shared';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CopyrightsService } from '../copyrights.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { fadeIn } from '@shared/animations';
import { SeriesService } from '../../series.service';
import { RootTemplateDto } from '../dtos';


@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  animations: [fadeIn]
})
export class PublishedComponent implements OnInit {

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
  tags = [];
  search: string;
  companyList = [];
  seriesType = [
    { label: '电视剧', value: 'tv' },
    { label: '电影', value: 'film' },
    { label: '综艺', value: 'variety' },
    { label: '动画', value: 'anime' },
    { label: '纪录片', value: 'documentary' },
    { label: '其他', value: 'other' }];
  constructor(
    private service: CopyrightsService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ts: TreeService,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.search = param.get('search');
      this.fetchCopyrights(this.service.getDefaultFiltrateSeriesParams(this.search));
    });
    this.seriesService.eventEmit.emit('pubRights');
    this.loadAreaOptions();
    this.loadRightsOptions();
    this.filtrateForm = this.fb.group({
      days: ['all'],
      right: [['all']],
      area: [''],
      date: [null],
      sole: [false],
      custom_id: [null],
      investment_type: [null],
      program_type: [null]
    });
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

  loadAreaOptions() {
    this.service.getCopyrightAreaOptions().subscribe(result => {
      this.areaOptions = this.getStatisticsSelectArea(result);
    });
  }

  loadRightsOptions() {
    this.service.getCopyrightTemplates().subscribe(result => {
      if (result) {
        result = [{ code: 'all', name: '所有' }, ...result];
        this.service.setLeafNode(result);
      }
      this.rightOptions = result;
    });
  }

  fetchCopyrights(params: any) {
    this.isLoading = true;
    this.service.getPubRights(this.pagination, params)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
      }))
      .subscribe(result => {
        this.dataSet = this.mapCopyrights(result.list);
        this.pagination = result.pagination;
        this.companyList = result.custom_list;
      });
  }

  mapCopyrights(list: any[]) { // 可考虑使用公共方法
    const rights = [];
    let itemIndex = 0;
    list.forEach(item => {
      let index = 0;
      item.rights.forEach(right => {
        rights.push({
          index: index++,
          itemIndex: itemIndex,
          pid: item.program_id,
          rid: right.id,
          cid: item.custom_id,
          id: item.id,
          project: item.program_name,
          contract_number: item.contract_number,
          custom_name: item.custom_name,
          share_amount: item.share_amount,
          total_amount: item.total_amount,
          type: item.program_type,
          episode: item.episode,
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

  getDatePipe() {
    return new DatePipe('zh-CN');
  }

  formatDate(pipe: DatePipe, date: Date) {
    return date ? pipe.transform(date, 'yyyy-MM-dd') : null;
  }

  filtrate() {
    const datePipe = this.getDatePipe();
    const area = this.filtrateForm.value['area'];
    const right = this.filtrateForm.value['right'] as string[];
    const trem = this.filtrateForm.value['date'] as Date[];
    const params = {
      due_date: this.filtrateForm.value['days'] || '',
      // area_number: area.length > 0 ? area[area.length - 1] : '',
      area_number: area,
      sole: this.filtrateForm.value['sole'] ? '1' : '0',
      right_type: right.length > 0 ? right[right.length - 1] : '',
      start_date: trem && trem.length > 0 ? this.formatDate(datePipe, trem[0]) : '',
      end_date: trem && trem.length > 0 ? this.formatDate(datePipe, trem[1]) : '',
      investment_type: this.filtrateForm.value['investment_type'] || '',
      custom_id: this.filtrateForm.value['custom_id'] || '',
      program_type: this.filtrateForm.value['program_type'] || '',
      search: this.search
    };
    console.log(params);
    this.fetchCopyrights(params);
  }

  deleteSeriesCopyright(pid: number) {
    this.service.deletePubCopyrights(pid).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.filtrate();
    });
  }

  onFormValueChange() {
    this.pagination.page = 1;
    this.filtrate();
  }

}
