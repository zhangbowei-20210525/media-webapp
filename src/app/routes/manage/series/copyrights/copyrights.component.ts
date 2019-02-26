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

  mapCopyrights(list: any[]) {
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
    const termStart = trem.length > 0 ? this.formatDate(datePipe, trem[0]) : '';
    const termEnd = trem.length > 0 ? this.formatDate(datePipe, trem[1]) : '';
    const areaValue = area.length > 0 ? area[area.length - 1] : '';
    const rightValue = right.length > 0 ? right[right.length - 1] : '';
    console.log(termStart, termEnd);
    this.fetchCopyrights(days, areaValue, rightValue, termStart, termEnd);
  }

  deleteSeriesCopyright(pid: number) {
    this.service.deleteCopyrights(pid).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.filtrate();
    });
  }

  onDaysChange(value: string) {
    console.log(value);
    this.filtrate();
  }

  onAreaChange(value: string[]) {
    console.log(value);
    this.filtrate();
  }

  onRightChange(value: string[]) {
    console.log(value);
    this.filtrate();
  }

  onDateChange(value: string[]) {
    console.log(value);
    this.filtrate();
  }

  // getOwnCopyrights() {
  //   this.seriesService.getOwnCopyrights(this.copyrightsPagination, '', '', '')
  //     .pipe(dtoMap(e => e.data), dtoCatchError()).pipe(map(x => {
  //       x.list.forEach(z => {
  //         if (z.series_type === 'tv') {
  //           z.series_type = '电视剧';
  //         }
  //         if (z.series_type === 'film') {
  //           z.series_type = '电影';
  //         }
  //         if (z.series_type === 'variety') {
  //           z.series_type = '综艺';
  //         }
  //         if (z.series_type === 'other') {
  //           z.series_type = '其他';
  //         }
  //         if (z.investment_type === 'purchase') {
  //           z.investment_type = '购入';
  //         }
  //         if (z.investment_type === 'proxy') {
  //           z.investment_type = '代理';
  //         }
  //         if (z.investment_type === 'follow') {
  //           z.investment_type = '跟投';
  //         }
  //         if (z.investment_type === 'main-vote') {
  //           z.investment_type = '主投';
  //         }
  //         if (z.investment_type === 'homemade') {
  //           z.investment_type = '自制';
  //         }
  //         if (z.investment_type === 'co-production') {
  //           z.investment_type = '合拍';
  //         }
  //         if (z.investment_type === 'contract') {
  //           z.investment_type = '承制';
  //         }
  //         if (z.investment_type === 'introduction') {
  //           z.investment_type = '引进';
  //         }

  //         if (z.network.length === 0) {
  //           z.network = '暂无权利';
  //         } else {
  //           z.network.map(n => { this.is_permanentn = n.is_permanent; });
  //           if ( this.is_permanentn === false ) {
  //             z.network = z.network.map(n => `${n.area_label}(${n.end_date})`).join(',');
  //           } else if (z.network.map(n => n.is_permanent === true)) {
  //             z.network = z.network.map(n => `${n.area_label}(永久)`).join(',');
  //           }
  //         }

  //         if (z.broadcast.length === 0) {
  //           z.broadcast = '暂无权利';
  //         } else {
  //           z.broadcast.map(n => { this.is_permanentb = n.is_permanent; });
  //           if ( this.is_permanentb === false) {
  //             z.broadcast = z.broadcast.map(n => `${n.area_label}(${n.end_date})`).join(',');
  //           } else {
  //             z.broadcast = z.broadcast.map(n => `${n.area_label}(永久)`).join(',');
  //           }
  //         }

  //         if (z.publish.length === 0) {
  //           z.publish = '暂无权利';
  //         } else {
  //           z.publish.map(n => { this.is_permanentnph = n.is_permanent; });
  //           if ( this.is_permanentnph === false) {
  //             z.publish = z.publish.map(n => `${n.area_label}(${n.end_date})`).join(',');
  //           } else {
  //             z.publish = z.publish.map(n => `${n.area_label}(永久)`).join(',');
  //           }
  //         }

  //         if (z.public.length === 0) {
  //           z.public = '暂无权利';
  //         } else {
  //           z.public.map(n => { this.is_permanentnpc = n.is_permanent; });
  //           if (this.is_permanentnpc === false) {
  //             z.public = z.public.map(n => `${n.area_label}(${n.end_date})`).join(',');
  //           } else {
  //             z.public = z.public.map(n => `${n.area_label}(永久)`).join(',');
  //           }
  //         }
  //       });
  //       return x;
  //     })).subscribe(res => {
  //       this.copyrightsList = res.list;
  //       this.copyrightsPagination = res.pagination;
  //     });
  // }

  // addCopyrightAgreed = (component: AddCopyrightComponent) => new Promise((resolve) => {
  //   if (component.checkContractForm()) {
  //     component.submitContractForm().subscribe(res => {
  //       this.messageService.success('添加版权成功');
  //       this.refreshCurrent();
  //       resolve();
  //     }, err => {
  //       this.messageService.error('添加版权失败：' + (typeof err.message === 'string' ? err.message : '服务器错误'));
  //       resolve(false);
  //     });
  //   } else {
  //     resolve(false);
  //   }
  // })

  // addPublish() {
  //   this.modalService.create({
  //     nzTitle: `新增发行`,
  //     nzContent: AddPublishComponent,
  //     nzMaskClosable: false,
  //     nzClosable: false,
  //     nzWidth: 800,
  //     nzOnOk: this.addPublishAgreed
  //   });
  // }

  // addPublishAgreed = (component: AddPublishComponent) => new Promise((resolve) => {
  //   if (component.checkContractForm()) {
  //     component.submitContractForm().subscribe(res => {
  //       this.messageService.success('新增发行成功');
  //       this.refreshCurrent();
  //       resolve();
  //     }, err => {
  //       this.messageService.error('新增发行失败：' + (typeof err.message === 'string' ? err.message : '服务器错误'));
  //       resolve(false);
  //     });
  //   } else {
  //     resolve(false);
  //   }
  // })

  // filtrate() {
  //   // this.refreshCurrent();
  // }

  // refreshCurrent() {
  //   this.fetchCopyrights(this.copyrightDate, this.copyrightArea, this.copyrightItem);
  // }

  // fetchCopyrights(term: string, area: string, right: string) {
  //   this.copyrightsService.getCopyrightList(this.copyrightsPagination, term, area, right)
  //     .pipe(dtoMap(e => e.data), dtoCatchError()).pipe(map(x => {
  //       x.list.forEach(z => {
  //         if (z.series_type === 'tv') {
  //           z.series_type = '电视剧';
  //         }
  //         if (z.series_type === 'film') {
  //           z.series_type = '电影';
  //         }
  //         if (z.series_type === 'variety') {
  //           z.series_type = '综艺';
  //         }
  //         if (z.series_type === 'other') {
  //           z.series_type = '其他';
  //         }
  //         if (z.investment_type === 'purchase') {
  //           z.investment_type = '购入';
  //         }
  //         if (z.investment_type === 'proxy') {
  //           z.investment_type = '代理';
  //         }
  //         if (z.investment_type === 'follow') {
  //           z.investment_type = '跟投';
  //         }
  //         if (z.investment_type === 'main-vote') {
  //           z.investment_type = '主投';
  //         }
  //         if (z.investment_type === 'homemade') {
  //           z.investment_type = '自制';
  //         }
  //         if (z.investment_type === 'co-production') {
  //           z.investment_type = '合拍';
  //         }
  //         if (z.investment_type === 'contract') {
  //           z.investment_type = '承制';
  //         }
  //         if (z.investment_type === 'introduction') {
  //           z.investment_type = '引进';
  //         }

  //         if (z.network.length === 0) {
  //           z.network = '暂无权利';
  //         } else {
  //           z.network.map(n => { this.is_permanentn = n.is_permanent; });
  //           if ( this.is_permanentn === false ) {
  //             z.network = z.network.map(n => `${n.area_label}(${n.end_date})`).join(',');
  //           } else if (z.network.map(n => n.is_permanent === true)) {
  //             z.network = z.network.map(n => `${n.area_label}(永久)`).join(',');
  //           }
  //         }

  //         if (z.broadcast.length === 0) {
  //           z.broadcast = '暂无权利';
  //         } else {
  //           z.broadcast.map(n => { this.is_permanentb = n.is_permanent; });
  //           if ( this.is_permanentb === false) {
  //             z.broadcast = z.broadcast.map(n => `${n.area_label}(${n.end_date})`).join(',');
  //           } else {
  //             z.broadcast = z.broadcast.map(n => `${n.area_label}(永久)`).join(',');
  //           }
  //         }

  //         if (z.publish.length === 0) {
  //           z.publish = '暂无权利';
  //         } else {
  //           z.publish.map(n => { this.is_permanentnph = n.is_permanent; });
  //           if ( this.is_permanentnph === false) {
  //             z.publish = z.publish.map(n => `${n.area_label}(${n.end_date})`).join(',');
  //           } else {
  //             z.publish = z.publish.map(n => `${n.area_label}(永久)`).join(',');
  //           }
  //         }

  //         if (z.public.length === 0) {
  //           z.public = '暂无权利';
  //         } else {
  //           z.public.map(n => { this.is_permanentnpc = n.is_permanent; });
  //           if (this.is_permanentnpc === false) {
  //             z.public = z.public.map(n => `${n.area_label}(${n.end_date})`).join(',');
  //           } else {
  //             z.public = z.public.map(n => `${n.area_label}(永久)`).join(',');
  //           }
  //         }
  //       });
  //       return x;      })).subscribe(res => {
  //       this.copyrightsList = res.list;
  //       this.copyrightsPagination = res.pagination;
  //     });
  // }

  // deleteCopyright(rightId: number) {
  //   this.modalService.confirm({
  //     nzTitle: '是否删除本条项目信息?',
  //     nzOkText: '删除',
  //     nzCancelText: '取消',
  //     nzOkType: 'danger',
  //     nzOnOk: () => this.deleteCopyrightAgreed(rightId)
  //   });
  // }

  // deleteCopyrightAgreed = (rightId: number) => new Promise((resolve) => {
  //   this.copyrightsService.deleteCopyright(rightId).subscribe(res => {
  //     this.getCopyrightsList();
  //     this.messageService.success('删除成功');
  //     resolve();
  //   }, err => {
  //     if (typeof err.message === 'string') {
  //       if (err.message !== 'form invalid') {
  //         this.messageService.error('删除失败：' + err.message);
  //       }
  //     } else {
  //       this.messageService.error('删除失败：服务器错误');
  //     }
  //     resolve(false);
  //   });
  // })

}
