import { Component, OnInit, Input } from '@angular/core';
import { PaginationDto } from '@shared';
import { Router } from '@angular/router';
import { CustomersService } from '../../../customers/customers.service';
// import { NzModalService, NzMessageService } from 'ng-zorro-antd';
// import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { ACLAbility } from '@core/acl';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'app-publicity-films',
  templateUrl: './publicity-films.component.html',
  styleUrls: ['./publicity-films.component.less']
})
export class PublicityFilmsComponent implements OnInit {

  @Input() id: number;
  isLoaded = false;
  isLoading = false;
  pagination = { page: 1, page_size: 10 } as PaginationDto;
  dataset: any;
  tagdataset = [];
  q = '';
  tag = '';
  customArray = [];
  array = [];
  searches: any;
  checkedArrayIds = [];
  checkedIds = [];
  content: any;
  liaison_id: any;
  meta: any;
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  constructor(
    public ability: ACLAbility,
    private router: Router,
    private service: CustomersService,
    // private modal: NzModalService,
    // private message: NzMessageService,
    // private translate: TranslateService,
    private acl: ACLService
  ) {
    console.log('can', ability.custom.view, acl.canAbility({ ability: [ability.custom.view] }));
  }

  ngOnInit() {
    this.fetchPublicities();
  }

  fetchPublicities() {
    this.isLoading = true;
    this.service.getPublicityFilms(this.pagination, this.tag, this.q)
      .pipe(finalize(() => {
        this.isLoading = false;
        if (!this.isLoaded) {
          this.isLoaded = true;
        }
      }))
      .subscribe(result => {
        // console.log(result);
        this.dataset = result.list;
        this.tagdataset = result.meta;
        // console.log(result.meta.tag_choices);
        // console.log(this.tagdataset);
        this.pagination = result.pagination;
        // for (let i = 0; i < result.list.length; i++) {
        //   console.log(result.list[i].cumtom.id );
        //   if (result.list[i].cumtom.id === this.array.list.cumtom.id) {
        //     return false;
        //   }
        //   this.array[this.array.length].push(result.list[i]);
        // }
        // console.log(this.array, '0000');

        // function uniq(array) {
        //   const temp = [];
        //   const index = [];
        //   const l = array.length;
        //   for (let i = 0; i < l; i++) {
        //     for (let j = i + 1; j < l; j++) {
        //       if (array[i].name === array[j].name) {
        //         i++;
        //         j = i;
        //       }
        //     }
        //     temp.push(array[i]);
        //     index.push(i);
        //   }
        //   console.log(index);
        //   return temp;
        // }
      });
  }

  pageChange(page: number) {
    this.pagination.page = page;
    this.fetchPublicities();
  }

  tapeDetails(program_id: number, tapeId: number, source_type: string) {
    this.router.navigate([`/manage/series/d/${program_id}/tape`, { tapeId: tapeId, source_type: source_type }]);
  }
  searchRemark(data: string) {
    this.tag = data;
    // console.log(this.tag);
    this.fetchPublicities();
  }

  checkChangeData(value: any, index: number) {
    const object = {
      value: value[0],
      index: index
    };
    let array = [];
    if (value[0] === undefined) {
      this.checkedArrayIds.splice(this.checkedArrayIds.indexOf(object[index]), 1, ...value);
    } else {
      this.checkedArrayIds.push(object);
    }
    this.checkedArrayIds.forEach(item => {
      array.push(item.value);
    });
    array = Array.from(new Set(array));
    this.checkedIds = array;
    // this.checkedIds = array.join(',');
  }
  getSearchData(data) {
    this.q = data;
  }
  search() {
    this.fetchPublicities();
  }
  // 实现全选功能
  currentPageDataChange($event: Array<{ id: number; name: string; age: number; address: string }>): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.checkedIds = [];
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    // console.log(this.mapOfCheckedId);
    // tslint:disable-next-line:forin
    for (const key in this.mapOfCheckedId) {
      if (this.mapOfCheckedId[key]) {
        this.checkedIds.push(Number(key));
      }
    }
    // console.log(this.checkedIds);
  }

  checkAll(value: boolean): void {
    this.checkedIds = [];
    this.listOfDisplayData.forEach(item => {
      this.mapOfCheckedId[item.id] = value;
    });
    // this.listOfDisplayData.forEach(item => {this.mapOfCheckedId[item.id] = value}
    //   );
    this.refreshStatus();
    // console.log(this.mapOfCheckedId, 'sssss');
    // tslint:disable-next-line:forin
    // console.log(this.checkedIds);
  }
}
