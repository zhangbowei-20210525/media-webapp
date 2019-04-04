import { Component, OnInit } from '@angular/core';
import { PaginationDto, MessageService } from '@shared';
import { Router } from '@angular/router';
import { CopyrightsService } from './copyrights.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeIn } from '@shared/animations';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-copyrights',
  templateUrl: './copyrights.component.html',
  styleUrls: ['./copyrights.component.less'],
  animations: [fadeIn]
})
export class CopyrightsComponent implements OnInit {

  isLoaded = false;
  isLoading = false;
  dataSet = [];
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  filtrateForm: FormGroup;
  areaOptions: any[];
  rightOptions: any[];

  constructor(
    private service: CopyrightsService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadAreaOptions();
    this.loadRightsOptions();
    this.loadCopyrights();
    this.filtrateForm = this.fb.group({
      days: ['all'],
      area: [['000000']],
      right: [['all']],
      date: [null]
    });
  }

  addCopyrights() {
    this.router.navigate([`/manage/series/add-copyrights`]);
  }

  addPublishConpyrights() {
    this.router.navigate([`/manage/series/publish-rights`]);
  }

  loadCopyrights() {
    this.isLoading = true;
    this.service.getSeries(this.pagination, '', '', '', '', '').pipe(finalize(() => {
      this.isLoaded = true;
      this.isLoading = false;
    })).subscribe(result => {
      this.dataSet = this.mapCopyrights(result.list);
      this.pagination = result.pagination;
    });
  }

  loadAreaOptions() {
    this.service.getCopyrightAreaOptions().subscribe(result => {
      if (result) {
        this.service.setLeafNode(result);
      }
      this.areaOptions = result;
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

  fetchCopyrights(days: string, area: string, right: string, termStart: string, termEnd: string) {
    this.isLoading = true;
    this.service.getSeries(this.pagination, days, area, right, termStart, termEnd)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(result => {
        this.dataSet = this.mapCopyrights(result.list);
        this.pagination = result.pagination;
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
          pid: item.id,
          rid: right.id,
          project: item.name,
          investmentType: item.investment_type,
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
    const days = this.filtrateForm.value['days'] as string;
    const area = this.filtrateForm.value['area'] as string[];
    const right = this.filtrateForm.value['right'] as string[];
    const trem = this.filtrateForm.value['date'] as Date[];
    const termStart = trem && trem.length > 0 ? this.formatDate(datePipe, trem[0]) : '';
    const termEnd = trem && trem.length > 0 ? this.formatDate(datePipe, trem[1]) : '';
    const areaValue = area.length > 0 ? area[area.length - 1] : '';
    const rightValue = right.length > 0 ? right[right.length - 1] : '';
    this.fetchCopyrights(days, areaValue, rightValue, termStart, termEnd);
  }

  deleteSeriesCopyright(pid: number) {
    this.service.deleteCopyrights(pid).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.filtrate();
    });
  }

  onDaysChange(value: string) {
    this.filtrate();
  }

  onAreaChange(value: string[]) {
    this.filtrate();
  }

  onRightChange(value: string[]) {
    this.filtrate();
  }

  onDateChange(value: string[]) {
    this.filtrate();
  }

}
