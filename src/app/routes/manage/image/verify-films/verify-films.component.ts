
import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SeriesService } from '../../series/series.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { switchMap, tap, map } from 'rxjs/operators';
import { PaginationDto } from '@shared';
import { I18nService } from '@core';
// import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

declare function videojs(selector: string);

@Component({
  selector: 'app-verify-films',
  templateUrl: './verify-films.component.html',
  styleUrls: ['./verify-films.component.less']
})
export class VerifyFilmsComponent implements OnInit {
  verifyStatus = 1;
  checkedArrayIds = [];
  checkedIds: string;
  type: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seriesService: SeriesService,
    private i18n: I18nService,
    private modal: NzModalService,
    private message: NzMessageService,

  ) { }

  ngOnInit() {

  }
  // 判断审核状态
  firstVerify(data: number) {
    this.verifyStatus = data;
  }

  secondVerify(data: number) {
    this.verifyStatus = data;
  }

  thirdVerify(data: number) {
    this.verifyStatus = data;
  }
  goSecondVerify(data: number) {
    if (this.checkedArrayIds.length === 0) {
      console.log('请选择审核样片');
      this.message.error('请选择审核样片');
    } else {
      this.verifyStatus = data;
    }
  }
  goThirdVerify(data: number) {
    this.verifyStatus = data;
  }
  // 获取数据列表
  // getDataList() {
  //   if (this.verifyStatus === 1) {

  //   } else if (this.verifyStatus === 2) {

  //   } else {

  //   }
  // }
  checkoutDetails() {
    this.router.navigate([`/manage/image/films-details`]);
  }

   // 多选框
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
    this.checkedIds = array.join(',');
  }
  // 排序
  ordrbyTop (data: number) {
    this.type = data;
    console.log(this.type);
  }
  orderbyBottom (data: number) {
    this.type = data;
    console.log(this.type);
  }
}
