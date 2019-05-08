import { Component, OnInit, ViewChild } from '@angular/core';
import * as G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { SeriesService } from '../series/series.service';
import { DashboardService } from './dashboard.service';
import { map } from 'rxjs/operators';
import { NzTreeNodeOptions, NzTreeComponent, NzTreeSelectComponent, NzTreeNode } from 'ng-zorro-antd';
import { TreeService, MessageService, Util } from '@shared';
import { DashboardDto } from './dtos';
import { TranslateService } from '@ngx-translate/core';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  activeProject: string;
  showTable: number;
  timeFiltrate: any;
  right: any;
  publish_right: any;
  payment: any;
  receipt: any;
  time: string;
  publicityData: any;
  publicityChart: any;
  sseriesTypeChart: any;
  pubType: string;
  publishChart: any;
  tapeType: string;
  tapeChart: any;
  seriesLineChart: any;
  startYear: any;
  seriesTime = 'month';
  sortType = 'negative';
  seriesCriteria = 'program_type';
  endYear: any;
  seriesInvestmentChart: any;
  seriesThemeChart: any;
  conversionGraphics = 'pieChart';
  content: any;
  activeProjectRight = [];
  activeProjectPubRight = [];
  activeProjectPublicity = [];
  activeProjectSource = [];
  statisticsSelectYear = [];
  statisticsSelectArea = [];
  allStatisticsChart: any;
  listOfOption = [];
  areaOptions = [];
  allStatistics: NzTreeNodeOptions[];
  checkedAreaCode = [];
  spread = [];
  timeType = 'quarter';
  sid: string;
  t1: any;
  t2: any;
  t3: any;
  t4: any;

  data5 = [{
    label: '汽车',
    value: 34
  }, {
    label: '建材家居',
    value: 85
  }, {
    label: '住宿旅游',
    value: 103
  }, {
    label: '交通运输与仓储邮政',
    value: 142
  }];

  data4 = [{
    type: '汽车',
    value: 34
  }, {
    type: '建材家居',
    value: 85
  }, {
    type: '住宿旅游',
    value: 103
  }, {
    type: '交通运输与仓储邮政',
    value: 142
  }, {
    type: '建筑房地产',
    value: 251
  }, {
    type: '教育',
    value: 367
  }, {
    type: 'IT 通讯电子',
    value: 491
  }, {
    type: '社会公共管理',
    value: 672
  }, {
    type: '医疗卫生',
    value: 868
  }, {
    type: '金融保险',
    value: 1234
  }];
  data3 = [
    { 'line': '浏览量', 'label': '12', 'value': 1705 },
    { 'line': '浏览量', 'label': '11', 'value': 178 },
    { 'line': '浏览量', 'label': '10', 'value': 186 },
    { 'line': '浏览量', 'label': '9', 'value': 213 },
    { 'line': '浏览量', 'label': '8', 'value': 247 },
    { 'line': '浏览量', 'label': '7', 'value': 272 },
    { 'line': '浏览量', 'label': '6', 'value': 316 },
    { 'line': '浏览量', 'label': '5', 'value': 382 },
    { 'line': '浏览量', 'label': '4', 'value': 428 },
    { 'line': '浏览量', 'label': '3', 'value': 468 },
    { 'line': '浏览量', 'label': '2', 'value': 537 },
    { 'line': '浏览量', 'label': '1', 'value': 6 },
    { 'line': '点赞', 'label': '12', 'value': 1635 },
    { 'line': '点赞', 'label': '11', 'value': 16 },
    { 'line': '点赞', 'label': '10', 'value': 158 },
    { 'line': '点赞', 'label': '9', 'value': 155 },
    { 'line': '点赞', 'label': '8', 'value': 151 },
    { 'line': '点赞', 'label': '7', 'value': 2725 },
    { 'line': '点赞', 'label': '6', 'value': 255 },
    { 'line': '点赞', 'label': '5', 'value': 3 },
    { 'line': '点赞', 'label': '4', 'value': 477 },
    { 'line': '点赞', 'label': '3', 'value': 625 },
    { 'line': '点赞', 'label': '2', 'value': 62 },
    { 'line': '点赞', 'label': '1', 'value': 54 },
    { 'line': '收藏', 'label': '12', 'value': 1973 },
    { 'line': '收藏', 'label': '11', 'value': 1982 },
    { 'line': '收藏', 'label': '10', 'value': 1978 },
    { 'line': '收藏', 'label': '9', 'value': 1882 },
    { 'line': '收藏', 'label': '8', 'value': 1762 },
    { 'line': '收藏', 'label': '7', 'value': 1715 },
    { 'line': '收藏', 'label': '6', 'value': 1805 },
    { 'line': '收藏', 'label': '5', 'value': 1865 },
    { 'line': '收藏', 'label': '4', 'value': 187 },
    { 'line': '收藏', 'label': '3', 'value': 23 },
    { 'line': '收藏', 'label': '2', 'value': 2639 },
    { 'line': '收藏', 'label': '1', 'value': 2832 },
  ];
  data2 = [{
    date: '2018/8/1',
    type: 'download',
    value: 4623
  }, {
    date: '2018/8/1',
    type: 'register',
    value: 2208
  }, {
    date: '2018/8/1',
    type: 'bill',
    value: 182
  }, {
    date: '2018/8/2',
    type: 'download',
    value: 6145
  }, {
    date: '2018/8/2',
    type: 'register',
    value: 2016
  }, {
    date: '2018/8/2',
    type: 'bill',
    value: 257
  }, {
    date: '2018/8/3',
    type: 'download',
    value: 508
  }, {
    date: '2018/8/3',
    type: 'register',
    value: 2916
  }, {
    date: '2018/8/3',
    type: 'bill',
    value: 289
  }, {
    date: '2018/8/4',
    type: 'download',
    value: 6268
  }, {
    date: '2018/8/4',
    type: 'register',
    value: 4512
  }, {
    date: '2018/8/4',
    type: 'bill',
    value: 428
  }, {
    date: '2018/8/5',
    type: 'download',
    value: 6411
  }, {
    date: '2018/8/5',
    type: 'register',
    value: 8281
  }, {
    date: '2018/8/5',
    type: 'bill',
    value: 619
  }, {
    date: '2018/8/6',
    type: 'download',
    value: 1890
  }, {
    date: '2018/8/6',
    type: 'register',
    value: 2008
  }, {
    date: '2018/8/6',
    type: 'bill',
    value: 87
  }, {
    date: '2018/8/7',
    type: 'download',
    value: 4251
  }, {
    date: '2018/8/7',
    type: 'register',
    value: 1963
  }, {
    date: '2018/8/7',
    type: 'bill',
    value: 706
  }, {
    date: '2018/8/8',
    type: 'download',
    value: 2978
  }, {
    date: '2018/8/8',
    type: 'register',
    value: 2367
  }, {
    date: '2018/8/8',
    type: 'bill',
    value: 387
  }, {
    date: '2018/8/9',
    type: 'download',
    value: 3880
  }, {
    date: '2018/8/9',
    type: 'register',
    value: 2956
  }, {
    date: '2018/8/9',
    type: 'bill',
    value: 488
  }, {
    date: '2018/8/10',
    type: 'download',
    value: 3606
  }, {
    date: '2018/8/10',
    type: 'register',
    value: 678
  }, {
    date: '2018/8/10',
    type: 'bill',
    value: 507
  }, {
    date: '2018/8/11',
    type: 'download',
    value: 4311
  }, {
    date: '2018/8/11',
    type: 'register',
    value: 3188
  }, {
    date: '2018/8/11',
    type: 'bill',
    value: 548
  }, {
    date: '2018/8/12',
    type: 'download',
    value: 4116
  }, {
    date: '2018/8/12',
    type: 'register',
    value: 3491
  }, {
    date: '2018/8/12',
    type: 'bill',
    value: 456
  }, {
    date: '2018/8/13',
    type: 'download',
    value: 6419
  }, {
    date: '2018/8/13',
    type: 'register',
    value: 2852
  }, {
    date: '2018/8/13',
    type: 'bill',
    value: 689
  }, {
    date: '2018/8/14',
    type: 'download',
    value: 1643
  }, {
    date: '2018/8/14',
    type: 'register',
    value: 4788
  }, {
    date: '2018/8/14',
    type: 'bill',
    value: 280
  }, {
    date: '2018/8/15',
    type: 'download',
    value: 445
  }, {
    date: '2018/8/15',
    type: 'register',
    value: 4319
  }, {
    date: '2018/8/15',
    type: 'bill',
    value: 176
  }];
  data1 = [{
    label: '事例一',
    value: 40,
    percent: 0.4
  }, {
    label: '事例二',
    value: 21,
    percent: 0.21
  }, {
    label: '事例三',
    value: 17,
    percent: 0.17
  }, {
    label: '事例四',
    value: 13,
    percent: 0.13
  }, {
    label: '事例五',
    value: 9,
    percent: 0.09
  }];
  data = [{
    'State': '第一季度',
    '中国(未付款)': 30,
    '中国(已付款)': 70,
    '英国(已付款)': 100,
    '英国(未付款)': 200,
    '美国(已付款)': 400,
    '美国(未付款)': 400,
    '法国(已付款)': 500,
    '法国(未付款)': 100,
    '日本(已付款)': 50,
    '日本(未付款)': 250,
  }, {
    'State': '第二季度',
    '中国(已付款)': 70,
    '中国(未付款)': 30,
    '英国(已付款)': 100,
    '英国(未付款)': 200,
    '美国(已付款)': 400,
    '美国(未付款)': 400,
    '法国(已付款)': 500,
    '法国(未付款)': 100,
    '日本(已付款)': 50,
    '日本(未付款)': 250,
  }, {
    'State': '第三季度',
    '中国(已付款)': 70,
    '中国(未付款)': 30,
    '英国(已付款)': 100,
    '英国(未付款)': 200,
    '美国(已付款)': 400,
    '美国(未付款)': 400,
    '法国(已付款)': 500,
    '法国(未付款)': 100,
    '日本(已付款)': 50,
    '日本(未付款)': 250,
  }, {
    'State': '第四季度',
    '中国(已付款)': 70,
    '中国(未付款)': 30,
    '英国(已付款)': 100,
    '英国(未付款)': 200,
    '美国(已付款)': 400,
    '美国(未付款)': 400,
    '法国(已付款)': 500,
    '法国(未付款)': 100,
    '日本(已付款)': 50,
    '日本(未付款)': 250,
  }
  ];
  @ViewChild('allStatisticsTree') allStatisticsTree: NzTreeSelectComponent;

  constructor(
    private dashboardService: DashboardService,
    private ts: TreeService,
    private message: MessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.seriesCriteria = 'program_type';
    this.time = 'day';
    this.pubType = 'custom';
    this.tapeType = 'publish';
    this.activeProject = 'right';
    this.showTable = 1;
    this.dashboardService.getExpireInfo().pipe(map(m => {
      m.right.data.length = 5;
      m.publish_right.data.length = 5;
      m.payment.data.length = 5;
      m.receipt.data.length = 5;
      return m;
    })).subscribe(res => {
      this.right = res.right;
      this.publish_right = res.publish_right;
      this.payment = res.payment;
      this.receipt = res.receipt;
    });
    this.getSeriesType();
    this.getSeriesInvestment();
    this.getSeriesTheme();
    // this.getSeriesLine();
    // this.getPublicityStatisticsInfo();
    this.getPublishStatisticsInfo();
    this.getTapeStatisticsInfo();
    this.getAllStatisticsInfo();
    this.dashboardService.getActiveProject('right').subscribe(res => {
      this.activeProjectRight = res;
    });
  }

  searchChange(event) {
    this.dashboardService.searchSeries(event, ['']).subscribe(res => {
      this.listOfOption = res.list;
    });
  }

  selectSeries() {
    if (this.content.length === 0) {
      this.sid = '';
    } else {
      const seriesInfo = this.listOfOption.find(x => x.name === this.content[0]);
      this.sid = seriesInfo.id;
    }
    if (this.timeFiltrate === undefined) {
      this.timeFiltrate = [''];
    }
    if (this.checkedAreaCode === undefined) {
      this.checkedAreaCode = [''];
    }

    if (this.timeType === 'annual') {
      if (this.checkedAreaCode.length < 6) {
        this.dashboardService.getAnnualStatistics(this.timeFiltrate, this.checkedAreaCode, this.sid).subscribe(res => {
          this.allStatisticsChart.source(res.list);
          this.allStatisticsChart.render();
        });
      } else {
        this.message.warning(this.translate.instant('app.home-page.statistics-operation-instruction'));
        this.checkedAreaCode.splice(this.timeFiltrate.length - 1, 1);
      }
    } else {
      if (this.checkedAreaCode.length < 6) {
        this.dashboardService.getAllStatistics(this.timeFiltrate, this.checkedAreaCode, this.sid).subscribe(res => {
          // this.selectArea = this.getStatisticsSelectArea(res.meta.area_number_choices);
          this.statisticsSelectYear = res.meta.year_choices;
          this.allStatisticsChart.source(res.list);
          this.allStatisticsChart.render();
        });
      } else {
        this.message.warning(this.translate.instant('app.home-page.statistics-operation-instruction'));
        this.checkedAreaCode.splice(this.timeFiltrate.length - 1, 1);
      }
    }

  }

  getStatisticsSelectArea(origins: DashboardDto[]): NzTreeNodeOptions[] {
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

  getAllStatisticsInfo() {
    // const _DataSet = DataSet,
    //   DataView = _DataSet.DataView;
    //   const _G = G2,
    //   Chart = _G.Chart;
    //   const ages = [
    //   '中国(未付款)',
    //   '中国(已付款)',
    //   '英国(未付款)',
    //   '英国(已付款)',
    //   '美国(未付款)',
    //   '美国(已付款)',
    //   '法国(未付款)',
    //   '法国(已付款)',
    //   '日本(未付款)',
    //   '日本(已付款)',
    // ];
    // const dv = new DataView();
    // dv.source(this.data).transform({
    //   type: 'fold',
    //   fields: ages,
    //   key: 'age',
    //   value: 'population',
    //   retains: ['State']
    // }).transform({
    //   type: 'map',
    //   callback: function callback(obj) {
    //     const key = obj.age;
    //     let type = void 0;
    //     if (key === '中国(未付款)' || key === '中国(已付款)') {
    //       type = 'a';
    //     } else if (key === '英国(已付款)' || key === '英国(未付款)') {
    //       type = 'b';
    //     } else if (key === '美国(已付款)' || key === '美国(未付款)') {
    //       type = 'c';
    //     } else if (key === '法国(已付款)' || key === '法国(未付款)') {
    //       type = 'd';
    //     } else if (key === '日本(已付款)' || key === '日本(未付款)') {
    //       type = 'e';
    //     }
    //     obj.type = type;
    //     return obj;
    //   }
    // });
    // const colorMap = {
    //   '中国(已付款)': '#660000',
    //   '中国(未付款)': '#663300',
    //   '英国(已付款)': '#006600',
    //   '英国(未付款)': '#009900',
    //   '美国(已付款)': '#404040',
    //   '美国(未付款)': '#707070',
    //   '法国(已付款)': '#3366FF',
    //   '法国(未付款)': '#3399FF',
    //   '日本(已付款)': '#CC9933',
    //   '日本(未付款)': '#CCCC33',
    // };
    // this.allStatisticsChart = new Chart({
    //   container: 'allStatistics',
    //   forceFit: true,
    //   width: 1000,
    //   height: 425,
    //   padding: [10, 30, 80, 50]
    // });
    // this.allStatisticsChart.source(dv, {
    //   population: {
    //     alias: '总金额（万元）',
    //   }
    // });
    // this.allStatisticsChart.axis('population', {
    //   // label: {
    //   //   formatter: function formatter(val) {
    //   //     return val / 1000000 + 'M';
    //   //   }
    //   // }
    // });
    // this.allStatisticsChart.legend({
    //   position: 'bottom-center'
    // });
    // this.allStatisticsChart.interval().position('State*population').color('age', function (age) {
    //   return colorMap[age];
    // }).tooltip('age*population', function (age, population) {
    //   return {
    //     name: age,
    //     value: population
    //   };
    // }).adjust([{
    //   type: 'dodge',
    //   dodgeBy: 'type', // 按照 type 字段进行分组
    //   marginRatio: 0 // 分组中各个柱子之间不留空隙
    // }, {
    //   type: 'stack'
    // }]);
    // this.allStatisticsChart.render();

    this.dashboardService.getAllStatistics('', '', '').subscribe(res => {
      this.areaOptions = this.getStatisticsSelectArea(res.meta.area_number_choices);
      this.spread = ['000000'];
      this.statisticsSelectYear = res.meta.year_choices;
      this.allStatisticsChart = new G2.Chart({
        container: 'allStatistics',
        forceFit: true,
        width: 1000,
        height: 425,
        padding: [10, 30, 80, 50]
      });
      this.allStatisticsChart.source(res.list);
      this.allStatisticsChart.scale('value', {
        alias: '总金额（万元）',
      });
      this.allStatisticsChart.axis('label', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        },
        tickLine: {
          alignWithLabel: false,
          length: 0
        }
      });
      this.allStatisticsChart.axis('value', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        },
        title: {
          offset: 40,
          position: 'center',
        }
      });
      this.allStatisticsChart.legend({
        position: 'bottom-center'
      });
      this.allStatisticsChart.interval().position('label*value').color('line').opacity(1).adjust([{
        type: 'dodge',
        marginRatio: 1 / 32
      }]);
      this.allStatisticsChart.render();
    });
  }

  getSeriesLine() {
    this.dashboardService.getPublicityStatistics('day').subscribe(res => {
      this.t2 = res.length;
      const dv = new DataSet.View().source(this.data3);
      dv.transform({
        type: 'sort',
        callback: function callback(a, b) {
          return a.label - b.label;
        }
      });

      this.seriesLineChart = new G2.Chart({
        container: 'seriesLine',
        forceFit: true,
        width: 1000,
        height: 400,
        padding: [10, 30, 80, 30]
      });
      this.seriesLineChart.source(dv);
      this.seriesLineChart.scale('label', {
        range: [0, 1]
      });
      this.seriesLineChart.axis('label', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      });
      this.seriesLineChart.axis('value', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      });
      this.seriesLineChart.tooltip({
        shared: true,
      });
      this.seriesLineChart.line().position('label*value').color('line').size('line', function (val) {
        return 2;
      }).opacity('line', function (val) {
        return 0.7;
      });
      this.seriesLineChart.point().position('label*value').color('line').size('line', function (val) {
        return 0;
      }).style({
        lineWidth: 2
      });
      this.seriesLineChart.render();
    });
  }

  getSeriesInvestment() {
    this.dashboardService.getSeriesStatistics('program_type').subscribe(res => {
      this.t1 = res.length;
      this.seriesInvestmentChart = new G2.Chart({
        container: 'seriesInvestment',
        forceFit: true,
        width: 300,
        height: 400,
        padding: [0, 0, 0, 0]
      });
      this.seriesInvestmentChart.source(this.data1, {
        percent: {
          formatter: function formatter(val) {
            val = val + '%';
            return val;
          }
        }
      });
      this.seriesInvestmentChart.coord('theta', {
        radius: 0.5,
        innerRadius: 0,
        startAngle: -1 * Math.PI / 2,
        endAngle: 3 * Math.PI / 2
      });
      this.seriesInvestmentChart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      this.seriesInvestmentChart.intervalStack().position('percent').color('label').label('percent', {
        formatter: function formatter(val, label) {
          return label.point.label + ': ' + val;
        }
      }).tooltip('label*percent', function (label, percent) {
        percent = percent + '%';
        return {
          name: label,
          value: percent
        };
      }).style({
        lineWidth: 1,
        stroke: '#fff'
      });
      this.seriesInvestmentChart.render();
    });
  }

  getSeriesTheme() {
    this.dashboardService.getSeriesStatistics('program_type').subscribe(res => {
      this.t1 = res.length;
      this.seriesThemeChart = new G2.Chart({
        container: 'seriesTheme',
        forceFit: true,
        width: 300,
        height: 400,
        padding: [0, 0, 0, 0]
      });
      this.seriesThemeChart.source(this.data1, {
        percent: {
          formatter: function formatter(val) {
            val = val + '%';
            return val;
          }
        }
      });
      this.seriesThemeChart.coord('theta', {
        radius: 0.5,
        innerRadius: 0,
        startAngle: -1 * Math.PI / 2,
        endAngle: 3 * Math.PI / 2
      });
      this.seriesThemeChart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      this.seriesThemeChart.intervalStack().position('percent').color('label').label('percent', {
        formatter: function formatter(val, label) {
          return label.point.label + ': ' + val;
        }
      }).tooltip('label*percent', function (label, percent) {
        percent = percent + '%';
        return {
          name: label,
          value: percent
        };
      }).style({
        lineWidth: 1,
        stroke: '#fff'
      });
      this.seriesThemeChart.render();
    });
  }

  getSeriesType() {
    this.dashboardService.getSeriesStatistics('program_type').subscribe(res => {
      this.t1 = res.length;
      this.sseriesTypeChart = new G2.Chart({
        container: 'seriesType',
        forceFit: true,
        width: 300,
        height: 400,
        padding: [0, 0, 0, 0]
      });
      this.sseriesTypeChart.source(this.data1, {
        percent: {
          formatter: function formatter(val) {
            val = val + '%';
            return val;
          }
        }
      });
      this.sseriesTypeChart.coord('theta', {
        radius: 0.5,
        innerRadius: 0,
        startAngle: -1 * Math.PI / 2,
        endAngle: 3 * Math.PI / 2
      });
      this.sseriesTypeChart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      this.sseriesTypeChart.intervalStack().position('percent').color('label').label('percent', {
        formatter: function formatter(val, label) {
          return label.point.label + ': ' + val;
        }
      }).tooltip('label*percent', function (label, percent) {
        percent = percent + '%';
        return {
          name: label,
          value: percent
        };
      }).style({
        lineWidth: 1,
        stroke: '#fff'
      });
      this.sseriesTypeChart.render();
    });
  }

  getPublicityStatisticsInfo() {
    this.dashboardService.getPublicityStatistics('day').subscribe(res => {
      this.t2 = res.length;
      const dv = new DataSet.View().source(res);
      dv.transform({
        type: 'sort',
        callback: function callback(a, b) {
          return a.label - b.label;
        }
      });
      this.publicityChart = new G2.Chart({
        container: 'publicityStatistics',
        forceFit: true,
        width: 520,
        height: 300,
        padding: [10, 30, 80, 30]
      });
      this.publicityChart.source(dv);
      this.publicityChart.scale('label', {
        range: [0, 1]
      });
      this.publicityChart.axis('label', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      });
      this.publicityChart.axis('value', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      });
      this.publicityChart.tooltip({
        shared: true,
      });
      this.publicityChart.line().position('label*value').color('line').size('line', function (val) {
        return 2;
      }).opacity('line', function (val) {
        return 0.7;
      });
      this.publicityChart.point().position('label*value').color('line').size('line', function (val) {
        return 0;
      }).style({
        lineWidth: 2
      });
      this.publicityChart.render();
    });
  }

  getPublishStatisticsInfo() {
    // this.dashboardService.getPublishStatistics('custom').subscribe(res => {
    //   this.t3 = res.length;
    //   this.publishChart = new G2.Chart({
    //     container: 'publishStatistics',
    //     forceFit: true,
    //     width: 520,
    //     height: 350,
    //   });
    //   this.publishChart.source(res);
    //   this.publishChart.scale('value', {
    //     tickCount: 4
    //   });
    //   this.publishChart.interval().position('label*value');
    //   this.publishChart.render();
    // });
    this.publishChart = new G2.Chart({
      container: 'publishStatistics',
      forceFit: true,
      width: 505,
      height: 450,
      padding: [20, 40, 50, 124]
    });
    this.publishChart.source(this.data4, {
      value: {
        max: 1300,
        min: 0,
        nice: false,
        alias: '销量（百万）'
      }
    });
    this.publishChart.axis('type', {
      label: {
        textStyle: {
          fill: '#8d8d8d',
          fontSize: 12
        }
      },
      tickLine: {
        alignWithLabel: false,
        length: 0
      },
      line: {
        lineWidth: 0
      }
    });
    this.publishChart.axis('value', {
      label: null,
      title: {
        offset: 30,
        textStyle: {
          fontSize: 12,
          fontWeight: 300
        }
      }
    });
    this.publishChart.legend(false);
    this.publishChart.coord().transpose();
    this.publishChart.interval().position('type*value').size(26).opacity(1).label('value', {
      textStyle: {
        fill: '#8d8d8d'
      },
      offset: 10
    });
    this.publishChart.render();
    // $('.sort-button').click(function() {
    //   sortType = sortType === 'positive' ? 'negative' : 'positive';
    //   sortData(sortType);
    //   chart.repaint();
    // });
    // function sortData(sortType) {
    //   if (sortType === 'positive') {
    //     data.sort(function(a, b) {
    //       return b.value - a.value;
    //     });
    //   } else {
    //     data.sort(function(a, b) {
    //       return a.value - b.value;
    //     });
    //   }
    // }
  }

  getTapeStatisticsInfo() {
    this.dashboardService.getTapeStatistics('publish').subscribe(res => {
      this.t4 = res.length;
      this.tapeChart = new G2.Chart({
        container: 'tapeStatistics',
        forceFit: true,
        width: 500,
        height: 450,
      });
      this.tapeChart.source(this.data5);
      this.tapeChart.scale('value', {
        tickInterval: 20
      });
      this.tapeChart.interval().position('label*value');
      this.tapeChart.render();
    });
  }

  switchoverSeriesCriteria() {
    // if (this.seriesCriteria === 'investment_type') {
    //   this.dashboardService.getSeriesStatistics('investment_type').subscribe(res => {
    //     this.seriesChart.source(res, {
    //       percent: {
    //         formatter: function formatter(val) {
    //           val = val + '%';
    //           return val;
    //         }
    //       }
    //     });
    //     this.seriesChart.render();
    //   });
    // }

    // if (this.seriesCriteria === 'program_type') {
    //   this.dashboardService.getSeriesStatistics('program_type').subscribe(res => {
    //     this.seriesChart.source(res, {
    //       percent: {
    //         formatter: function formatter(val) {
    //           val = val + '%';
    //           return val;
    //         }
    //       }
    //     });
    //     this.seriesChart.render();
    //   });
    // }
  }
  switchoverTime() {
    if (this.time === 'day') {
      this.dashboardService.getPublicityStatistics('day').subscribe(res => {
        const dv = new DataSet.View().source(res);
        dv.transform({
          type: 'sort',
          callback: function callback(a, b) {
            return a.label - b.label;
          }
        });
        this.publicityChart.source(dv);
        this.publicityChart.render();
      });
    }

    if (this.time === 'month') {
      this.dashboardService.getPublicityStatistics('month').subscribe(res => {
        const dv = new DataSet.View().source(res);
        dv.transform({
          type: 'sort',
          callback: function callback(a, b) {
            return a.label - b.label;
          }
        });
        this.publicityChart.source(dv);
        this.publicityChart.render();
      });
    }

    if (this.time === 'year') {
      this.dashboardService.getPublicityStatistics('year').subscribe(res => {
        const dv = new DataSet.View().source(res);
        dv.transform({
          type: 'sort',
          callback: function callback(a, b) {
            return a.label - b.label;
          }
        });
        this.publicityChart.source(dv);
        this.publicityChart.render();
      });
    }
  }

  switchoverPubType() {
    if (this.pubType === 'custom') {
      this.dashboardService.getPublishStatistics('custom').subscribe(res => {
        this.publishChart.source(res);
        this.publishChart.render();
      });
    }
    if (this.pubType === 'right') {
      this.dashboardService.getPublishStatistics('right').subscribe(res => {
        this.publishChart.source(res);
        this.publishChart.render();
      });

    }
    if (this.pubType === 'area') {
      this.dashboardService.getPublishStatistics('area').subscribe(res => {
        this.publishChart.source(res);
        this.publishChart.render();
      });
    }
  }

  switchoverTape() {
    if (this.tapeType === 'publish') {
      this.dashboardService.getTapeStatistics('publish').subscribe(res => {
        this.tapeChart.source(res);
        this.tapeChart.render();
      });
    }
    if (this.tapeType === 'purchase') {
      this.dashboardService.getTapeStatistics('purchase').subscribe(res => {
        this.tapeChart.source(res);
        this.tapeChart.render();
      });
    }
  }

  activeProjects() {
    if (this.activeProject === 'right') {
      this.showTable = 1;
      this.dashboardService.getActiveProject('right').subscribe(res => {
        this.activeProjectRight = res;
      });
    }
    if (this.activeProject === 'publish_right') {
      this.showTable = 2;
      this.dashboardService.getActiveProject('publish_right').subscribe(res => {
        this.activeProjectPubRight = res;
      });
    }
    if (this.activeProject === 'publicity') {
      this.showTable = 3;
      this.dashboardService.getActiveProject('publicity').subscribe(res => {
        this.activeProjectPublicity = res;
      });
    }
    if (this.activeProject === 'source') {
      this.showTable = 4;
      this.dashboardService.getActiveProject('source').subscribe(res => {
        this.activeProjectSource = res;
      });
    }
  }

  changeNodesState() {
    if (this.checkedAreaCode && this.checkedAreaCode.length > 0) {
      const nodes = this.allStatisticsTree.treeRef.getTreeNodes();
      if (nodes) {
        const firstKey = this.checkedAreaCode[0];
        const firstNodeParent = this.ts.recursionNodesFindBy(nodes, n => n.key === firstKey).getParentNode();
        this.ts.recursionNodes(nodes, n => {
          const parent = n.getParentNode();
          if (firstNodeParent ? (!parent || firstNodeParent.key !== parent.key) : parent) {
            n.isDisabled = true;
          }
        });
      }
    }
  }

  onOpenChange(state: boolean) {
    if (state === true) {
      setTimeout(() => {
        this.changeNodesState();
      }, 0);
    }
  }

  onAreaChange(event) {
    this.changeNodesState();
    this.checkedAreaCode = event;
    if (this.timeFiltrate === undefined) {
      this.timeFiltrate = [''];
    }
    if (this.sid === undefined) {
      this.sid = '';
    }
    if (this.timeType === 'annual') {
      if (event.length < 6) {
        this.dashboardService.getAnnualStatistics(this.timeFiltrate, this.checkedAreaCode, this.sid).subscribe(res => {
          // if (event.length > 0) {
          //   const nodes = this.allStatisticsTree.treeRef.getTreeNodes();
          //   this.ts.recursionNodes(nodes, node => {
          //     node.isDisabled = true;
          //   });
          // }
          // this.spread = ['000000'];
          this.allStatisticsChart.source(res.list);
          this.allStatisticsChart.render();
        });
      } else {
        this.message.warning(this.translate.instant('app.home-page.statistics-operation-instruction'));
        this.checkedAreaCode.splice(this.timeFiltrate.length - 1, 1);
      }
    } else {
      if (event.length < 6) {
        this.dashboardService.getAllStatistics(this.timeFiltrate, event, this.sid).subscribe(res => {

          // if (event.length > 0) {
          //   const nodes = this.allStatisticsTree.treeRef.getTreeNodes();
          //   this.ts.recursionNodes(nodes, node => {
          //     node.isDisabled = true;
          //   });
          // }
          // this.spread = ['000000'];
          this.statisticsSelectYear = res.meta.year_choices;
          this.allStatisticsChart.source(res.list);
          this.allStatisticsChart.render();
        });
      } else {
        this.message.warning(this.translate.instant('app.home-page.statistics-operation-instruction'));
        this.checkedAreaCode.splice(this.timeFiltrate.length - 1, 1);
      }
    }
  }

  yearChange(event) {
    this.timeFiltrate = event;
    if (this.checkedAreaCode === undefined) {
      this.checkedAreaCode = [''];
    }
    if (this.sid === undefined) {
      this.sid = '';
    }
    this.dashboardService.getAllStatistics(this.timeFiltrate, this.checkedAreaCode, this.sid).subscribe(res => {
      // this.selectArea = this.getStatisticsSelectArea(res.meta.area_number_choices);
      this.statisticsSelectYear = res.meta.year_choices;
      this.allStatisticsChart.source(res.list);
      this.allStatisticsChart.render();
    });
  }

  timeTypeChange(event) {
    this.timeType = event;
    if (this.timeType === 'annual') {
      this.dashboardService.getAnnualStatistics(this.timeFiltrate, this.checkedAreaCode, this.sid).subscribe(res => {
        this.allStatisticsChart.source([]);
        this.allStatisticsChart.source(res.list);
        this.allStatisticsChart.scale('value', {
          alias: '总金额（万元）',
        });
        this.allStatisticsChart.axis('label', {
          label: {
            textStyle: {
              fill: '#aaaaaa'
            }
          },
          tickLine: {
            alignWithLabel: false,
            length: 0
          }
        });
        this.allStatisticsChart.axis('value', {
          label: {
            textStyle: {
              fill: '#aaaaaa'
            }
          },
          title: {
            offset: 40,
            position: 'center',
          }
        });
        this.allStatisticsChart.legend({
          position: 'bottom-center'
        });
        this.allStatisticsChart.interval().position('label*value').color('line').opacity(1).adjust([{
          type: 'dodge',
          marginRatio: 1 / 32
        }]);
        this.allStatisticsChart.render();
      });
    } else {
      this.dashboardService.getAllStatistics(this.timeFiltrate, this.checkedAreaCode, this.sid).subscribe(res => {
        // this.selectArea = this.getStatisticsSelectArea(res.meta.area_number_choices);
        this.statisticsSelectYear = res.meta.year_choices;
        this.allStatisticsChart.source(res.list);
        this.allStatisticsChart.render();
      });
    }
  }

  cgChange() {
    if (this.conversionGraphics === 'pieChart') {
      this.seriesLineChart.destroy();
      this.getSeriesType();
      this.getSeriesInvestment();
      this.getSeriesTheme();
    }
    if (this.conversionGraphics === 'lineChart') {
      this.sseriesTypeChart.destroy();
      this.seriesThemeChart.destroy();
      this.seriesInvestmentChart.destroy();
      this.getSeriesLine();
    }
  }

  sortChange() {
    if (this.sortType === 'positive') {
      this.data4.sort(function (a, b) {
        return b.value - a.value;
      });
    } else {
      this.data4.sort(function (a, b) {
        return a.value - b.value;
      });
    }
    this.publishChart.repaint();
  }

  startYearChange() {
    if (this.endYear === undefined) {
      this.startYear = Util.dateToString(this.startYear).substring(0, 4);
    } else {
      const sy = +Util.dateToString(this.startYear).substring(0, 4);
      if (this.endYear - sy === 5) {
        this.startYear = Util.dateToString(this.startYear).substring(0, 4);
      } else {
        this.message.warning(this.translate.instant('app.dashboard.in-five-years'));
      }
    }
  }

  endYearChange() {
    if (this.startYear === undefined) {
      this.endYear = Util.dateToString(this.endYear).substring(0, 4);
    } else {
      const ey = +Util.dateToString(this.endYear).substring(0, 4);
      if (ey - this.startYear === 5) {
        this.endYear = Util.dateToString(this.endYear).substring(0, 4);
      } else {
        this.message.warning(this.translate.instant('app.dashboard.in-five-years'));
      }
    }
  }
}
