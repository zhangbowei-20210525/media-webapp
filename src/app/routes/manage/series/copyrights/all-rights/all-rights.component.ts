import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaginationDto, MessageService, TreeService, Util } from '@shared';
import { Router, ActivatedRoute, ParamMap, NavigationStart } from '@angular/router';
import { CopyrightsService } from '../copyrights.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeIn } from '@shared/animations';
import { finalize, switchMap, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { NzTreeNodeOptions } from 'ng-zorro-antd';
import { SeriesService } from '../../series.service';
import { RootTemplateDto } from '../dtos';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-rights',
  templateUrl: './all-rights.component.html',
  animations: [fadeIn]
})
export class AllRightsComponent implements OnInit, OnDestroy {

  subs: Subscription[];

  isLoaded = false;
  isLoading = false;
  dataSet = [];
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  filtrateForm: FormGroup;
  areaOptions: any[] = [];
  rightOptions: any[] = [];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  tags = [];
  search: string;
  seriesType = [];

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
    this.subs = [this.service.change().subscribe(state => {
      if (state.type === 'navigate' && state.value === 'publish') {
        const pids = this.tags.map(t => t.pid);
        if (pids.length > 0) {
          this.router.navigate(['/manage/series/publish-rights', { pids: pids }]);
        } else {
          this.router.navigate(['/manage/series/publish-rights']);
        }
      }
    })];
    this.route.paramMap.subscribe(param => {
      this.search = param.get('search');
      this.fetchCopyrights(this.service.getDefaultFiltrateSeriesParams(this.search));
    });
    this.seriesService.getProgramTypes().subscribe(result => {
      this.seriesType = result.program_type_choices;
    });
    this.loadAreaOptions();
    this.loadRightsOptions();
    this.filtrateForm = this.fb.group({
      days: [null],
      right: [[null]],
      area: [[null]],
      date: [null],
      is_salable: [false],
      sole: [false],
      investment_type: [null],
      program_type: [null]
    });
    this.filtrateForm.get('sole').disable();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
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

  currentPageDataChange($event) {
    this.listOfDisplayData = $event;
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => item.isChecked);
    this.isIndeterminate = this.listOfDisplayData.some(item => item.isChecked) && !this.isAllDisplayDataChecked;
  }

  onCheckedChange(state: Boolean, tag: any) {
    if (state) {
      this.tags = [...this.tags, tag];
      this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => item.isChecked === true);
      this.isIndeterminate = this.listOfDisplayData.some(item => item.isChecked === true) && !this.isAllDisplayDataChecked;

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
          this.tags.push(t);
        }
      });
      this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => item.isChecked = true);
      this.isIndeterminate = this.listOfDisplayData.some(item => item.isChecked) && !this.isAllDisplayDataChecked;

    } else {
      const pro = [];
      this.listOfDisplayData.forEach(item => {
        item.isChecked = value;
        pro.push(item);
      });
      const p = [];
      const t = [];
      pro.forEach(x => p.push(x.pid));
      this.tags.forEach(f => t.push(f.pid));
      const z = [
        ...Array.from(new Set([...t, ...p])).filter(e => !t.includes(e)),
        ...Array.from(new Set([...t, ...p])).filter(e => !p.includes(e))
      ];
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
          );
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

  // loadCopyrights() {
  //   this.isLoading = true;
  //   this.isLoaded = true;
  //   this.route.paramMap.pipe(
  //     switchMap((params: ParamMap) => {
  //       this.search = params.get('search');
  //       console.log(this.search);
  //       if(this.search === null) {
  //         return this.service.getSeries(this.pagination, '', '', '', '', '', '')
  //       } else {
  //         return this.service.getSearchSeries(this.search, this.pagination, '', '', '', '', '', '')
  //       }
  //     })).pipe(finalize(() => {
  //     this.isLoaded = true;
  //     this.isLoading = false;
  //   })).subscribe(result => {
  //     this.dataSet = this.mapCopyrights(result.list);
  //     this.pagination = result.pagination;
  //   });
  // }

  loadAreaOptions() {
    this.service.getCopyrightAreaOptions().subscribe(result => {
      // if (result) {
      //   result = [{ code: 'all', name: '所有' }, ...result];
      //   this.service.setLeafNode(result);
      // }
      this.areaOptions = this.getStatisticsSelectArea(result);
    });
  }

  loadRightsOptions() {
    this.service.getCopyrightTemplates().subscribe(result => {
      if (result) {
        result = [{ code: null, name: '所有' }, ...result];
        this.service.setLeafNode(result);
      }
      this.rightOptions = result;
    });
  }

  fetchCopyrights(params: any) {
    this.isLoading = true;
    this.service.getSeries(this.pagination, params)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isLoaded = true;
      }))
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

  filtrate() {
    const area = this.filtrateForm.value['area'] as string[];
    const right = this.filtrateForm.value['right'] as string[];
    const trem = this.filtrateForm.value['date'] as Date[];
    if (area && area.length > 0) {
      area.forEach((item, index) => {
        if (!item) {
          area[index] = '';
        }
      });
    }
    const params = {
      due_date: this.filtrateForm.value['days'] || '',
      // area_number: area.length > 0 ? area[area.length - 1] : '',
      area_number: area ? area : '',
      right_type: right.length > 0 ? right[right.length - 1] : '',
      start_date: trem && trem.length > 0 ? Util.dateToString(trem[0]) : '',
      end_date: trem && trem.length > 0 ? Util.dateToString(trem[1]) : '',
      is_salable: this.filtrateForm.value['is_salable'] ? '1' : '0',
      sole: this.filtrateForm.value['sole'] ? '1' : '0',
      investment_type: this.filtrateForm.value['investment_type'] || '',
      program_type: this.filtrateForm.value['program_type'] || '',
      search: this.search
    };
    params.right_type = params.right_type ? params.right_type : '';
    this.fetchCopyrights(params);
  }

  deleteSeriesCopyright(pid: number) {
    this.service.deleteCopyrights(pid).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.filtrate();
    });
  }

  onFormValueChange() {
    this.pagination.page = 1;
    this.filtrate();
  }

  onPublishChange(value: boolean) {
    if (!value) {
      this.filtrateForm.get('sole').setValue(false);
      this.filtrateForm.get('sole').disable();
    } else {
      this.filtrateForm.get('sole').enable();
    }
    this.onFormValueChange();
  }

}
