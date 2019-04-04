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
  pagination = { page: 1, page_size: 3 } as PaginationDto;
  filtrateForm: FormGroup;
  areaOptions: any[];
  rightOptions: any[];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  tags = [];
  

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
      is_salable: ['0'],
      date: [null]
    });
  }

  currentPageDataChange($event) {
    this.listOfDisplayData = $event;
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => item.isChecked);
    this.isIndeterminate = this.listOfDisplayData.some(item => item.isChecked) && !this.isAllDisplayDataChecked;
  }

  onCheckedChange(state: Boolean, tag: any) {
    if (state) {
      this.tags = [...this.tags, tag];
      this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => item.isChecked == true);
      this.isIndeterminate = this.listOfDisplayData.some(item => item.isChecked == true) && !this.isAllDisplayDataChecked;

    } else {
      this.tags = this.tags.filter(e => e.pid !== tag.pid);
      this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => item.isChecked);
      this.isIndeterminate = this.listOfDisplayData.some(item => item.isChecked) && !this.isAllDisplayDataChecked;

    }
  }

  checkAll(value: boolean, tags: any) {
    if (value) {
      tags.forEach(t => {
        if (this.tags.every(x => x.pid !== t.pid)) {
          this.tags.push(t)
        }
      });
      this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => item.isChecked = true);
      this.isIndeterminate = this.listOfDisplayData.some(item => item.isChecked) && !this.isAllDisplayDataChecked;

    } else {
      const pro = [];
      this.listOfDisplayData.forEach(item => {
        item.isChecked = value;
        pro.push(item)
      });
      const p = [];
      const t = [];
      pro.forEach(x => p.push(x.pid))
      this.tags.forEach(f => t.push(f.pid))
      const z = [...Array.from(new Set([...t, ...p])).filter(_ => !t.includes(_)), ...Array.from(new Set([...t, ...p])).filter(_ => !p.includes(_))];
      if (z.length === 0) {
        this.dataSet = pro;
        this.tags = [];
      } else {
        const gsn = [];
        this.service.getSeriesNames(z).subscribe(res => {
          res.list.forEach(r =>
            gsn.push({
              pid: r.id,
              project: r.name
            })
          )
          this.tags = [];
          this.tags = gsn;
        });
      }
    }
  }

  closeTag(tag: any) {
    this.tags = this.tags.filter(e => e.pid !== tag.pid);
    tag.isChecked = false;
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => item.isChecked);
    this.isIndeterminate = this.listOfDisplayData.some(item => item.isChecked) && !this.isAllDisplayDataChecked;

  }

  addCopyrights() {
    this.router.navigate([`/manage/series/add-copyrights`]);
  }

  addPublishConpyrights() {
    const pids = [];
    this.tags.forEach(r => pids.push(r.pid))
    if(pids.length === 0) {
      this.message.success(this.translate.instant('global.select-series'));
    } else {
      this.router.navigate([`/manage/series/publish-rights`, {pids: pids}]);
    }
  }

  loadCopyrights() {
    this.isLoading = true;
    this.service.getSeries(this.pagination, '', '', '', '', '', '').pipe(finalize(() => {
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

  fetchCopyrights(days: string, area: string, right: string, termStart: string, termEnd: string, is_salable: string) {
    this.isLoading = true;
    this.service.getSeries(this.pagination, days, area, right, termStart, termEnd, is_salable)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(result => {
        this.dataSet = this.mapCopyrights(result.list);
        this.pagination = result.pagination;
      });
  }

  mapCopyrights(list: any[]) {
    const rights = [];
    let itemIndex = 0;
    list.forEach(item => {
      let index = 0;
      item.rights.forEach(right => {
        rights.push({
          isChecked: this.tags.find(e => e.pid === item.id),
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
    const is_salable = this.filtrateForm.value['is_salable'];
    const termStart = trem && trem.length > 0 ? this.formatDate(datePipe, trem[0]) : '';
    const termEnd = trem && trem.length > 0 ? this.formatDate(datePipe, trem[1]) : '';
    const areaValue = area.length > 0 ? area[area.length - 1] : '';
    const rightValue = right.length > 0 ? right[right.length - 1] : '';
    this.fetchCopyrights(days, areaValue, rightValue, termStart, termEnd, is_salable);
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

  onPubRightChange(value: string) {
    this.filtrate();
  }

}
