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
  dateRange: any;
  publishChart: any;
  tapeType: string;
  tapeChart: any;
  customerSort: any;
  seriesLineChart: any;
  startYear: Date;
  seriesTime = 'month';
  sortType = 'negative';
  seriesCriteria = 'program_type';
  endYear: Date;
  seriesInvestmentChart: any;
  seriesThemeChart: any;
  conversionGraphics = 'pieChart';
  content: any;
  activeProjectRight = [];
  activeProjectPubRight = [];
  activeProjectPublicity = [];
  activeProjectSource = [];
  statisticsSelectYear = [];
  seriesInOut = 'purchase';
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
  t5: any;
  t6: any;

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
    const date = new Date();
    // date.setFullYear(date.getFullYear() - 4);
    this.startYear = date;
    this.endYear = date;
    this.getSeriesPieChart();
    // this.getPublicityStatisticsInfo();
    this.getCustomerStatisticsInfo();
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

  getSeriesPieChart() {
    this.dashboardService.getSeriesPieChart(this.startYear.getFullYear() + '', this.endYear.getFullYear() + '').subscribe(res => {
      this.getSeriesType(res.program_type);
      this.getSeriesInvestment(res.investment_type);
      this.getSeriesTheme(res.theme);
    });
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

  getSeriesLineChart() {
    this.dashboardService.getSeriesLineChart(this.seriesCriteria,
      this.startYear.getFullYear() + '', this.endYear.getFullYear() + '').subscribe(res => {
        this.t4 = res.length;
        const dv = new DataSet.View().source(res);
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

  getSeriesInvestment(res: any) {
    this.t2 = res.length;
    this.seriesInvestmentChart = new G2.Chart({
      container: 'seriesInvestment',
      forceFit: true,
      width: 300,
      height: 400,
      padding: [0, 0, 0, 0]
    });
    this.seriesInvestmentChart.source(res, {
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
  }

  getSeriesTheme(res: any) {
    this.t3 = res.length;
    this.seriesThemeChart = new G2.Chart({
      container: 'seriesTheme',
      forceFit: true,
      width: 300,
      height: 400,
      padding: [0, 0, 0, 0]
    });
    this.seriesThemeChart.source(res, {
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
  }

  getSeriesType(res: any) {
    this.t1 = res.length;
    this.sseriesTypeChart = new G2.Chart({
      container: 'seriesType',
      forceFit: true,
      width: 300,
      height: 400,
      padding: [0, 0, 0, 0]
    });
    this.sseriesTypeChart.source(res, {
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

  getCustomerStatisticsInfo() {
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
    this.dashboardService.getPurCustomer('', '').subscribe(res => {
      this.customerSort = res;
      this.t5 = res.length;
      this.publishChart = new G2.Chart({
        container: 'customerStatistics',
        forceFit: true,
        width: 505,
        height: 450,
        padding: [20, 40, 50, 124]
      });
      this.publishChart.source(res, {
        value: {
          nice: false,
          alias: '销量（万）'
        }
      });
      this.publishChart.axis('label', {
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
      this.publishChart.interval().position('label*value').size(26).opacity(1).label('value', {
        textStyle: {
          fill: '#8d8d8d'
        },
        offset: 10
      });
      this.publishChart.render();
    });
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
      this.t6 = res.length;
      this.tapeChart = new G2.Chart({
        container: 'tapeStatistics',
        forceFit: true,
        width: 500,
        height: 450,
      });
      this.tapeChart.source(res);
      this.tapeChart.scale('value', {
        tickInterval: 20
      });
      this.tapeChart.interval().position('label*value');
      this.tapeChart.render();
    });
  }

  switchoverSeriesCriteria() {
    this.getTransformLineChart();
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
      this.getSeriesPieChart();
    }
    if (this.conversionGraphics === 'lineChart') {
      this.sseriesTypeChart.destroy();
      this.seriesThemeChart.destroy();
      this.seriesInvestmentChart.destroy();
      this.getSeriesLineChart();
    }
  }

  sortChange() {
    if (this.sortType === 'positive') {
      this.customerSort.sort(function (a, b) {
        return b.value - a.value;
      });
    } else {
      this.customerSort.sort(function (a, b) {
        return a.value - b.value;
      });
    }
    this.publishChart.repaint();
  }

  startYearChange() {
    this.endYear = new Date(this.endYear.setFullYear(this.startYear.getFullYear() + 4));
    // if (this.endYear === '') {
    if (this.conversionGraphics === 'pieChart') {
      this.getTransformPieChart();
    }
    if (this.conversionGraphics === 'lineChart') {
      this.getTransformLineChart();
    }
    // } else {
    // const sy = +Util.dateToString(this.startYear).substring(0, 4);
    // if (this.endYear - sy === 4) {
    //   if (this.conversionGraphics === 'pieChart') {
    //     this.getTransformPieChart();
    //   }
    //   if (this.conversionGraphics === 'lineChart') {
    //     this.getTransformLineChart();
    //   }
    // } else {
    //   this.message.warning(this.translate.instant('app.dashboard.in-five-years'));
    // }
    // }
  }

  endYearChange() {
    // if (this.startYear === '') {
    this.startYear = new Date(this.startYear.setFullYear(this.endYear.getFullYear() - 4));
    if (this.conversionGraphics === 'pieChart') {
      this.getTransformPieChart();
    }
    if (this.conversionGraphics === 'lineChart') {
      this.getTransformLineChart();
    }
    // } else {
    // const ey = +Util.dateToString(this.endYear).substring(0, 4);
    // if (ey - this.startYear === 4) {
    //   if (this.conversionGraphics === 'pieChart') {
    //     this.getTransformPieChart();
    //   }
    //   if (this.conversionGraphics === 'lineChart') {
    //     this.getTransformLineChart();
    //   }
    // } else {
    //   this.message.warning(this.translate.instant('app.dashboard.in-five-years'));
    // }
    // }
  }

  getTransformPieChart() {
    this.dashboardService.getSeriesPieChart(this.startYear.getFullYear() + '', this.endYear.getFullYear() + '').subscribe(res => {
      this.t1 = res.program_type.length;
      this.t2 = res.investment_type.length;
      this.t3 = res.theme.length;
      this.seriesInvestmentChart.source(res.investment_type, {
        percent: {
          formatter: function formatter(val) {
            val = val + '%';
            return val;
          }
        }
      });
      this.seriesThemeChart.source(res.theme, {
        percent: {
          formatter: function formatter(val) {
            val = val + '%';
            return val;
          }
        }
      });
      this.sseriesTypeChart.source(res.program_type, {
        percent: {
          formatter: function formatter(val) {
            val = val + '%';
            return val;
          }
        }
      });
      this.seriesInvestmentChart.render();
      this.seriesThemeChart.render();
      this.sseriesTypeChart.render();
    });
  }


  getTransformLineChart() {
    this.dashboardService.getSeriesLineChart(this.seriesCriteria, this.startYear.getFullYear() + '',
      this.endYear.getFullYear() + '').subscribe(res => {
        this.t4  = res.length;
        this.seriesLineChart.source(res);
        this.seriesLineChart.render();
      });
  }

  seriesTimeChange() {
    if (this.seriesTime === 'month') {
      const date = new Date();
      // date.setFullYear(date.getFullYear() - 4);
      this.startYear = date;
      this.endYear = date;
      if (this.conversionGraphics === 'pieChart') {
        this.getTransformPieChart();
      }
      if (this.conversionGraphics === 'lineChart') {
        this.getTransformLineChart();
      }
    }
    if (this.seriesTime === 'year') {
      this.endYear = new Date();
      const date = new Date();
      date.setFullYear(date.getFullYear() - 4);
      this.startYear = date;
      if (this.conversionGraphics === 'pieChart') {
        this.getTransformPieChart();
      }
      if (this.conversionGraphics === 'lineChart') {
        this.getTransformLineChart();
      }
    }
  }

  getPurCustomer() {
    this.dashboardService.getPurCustomer(this.dateRange.length > 0 ? Util.dateToString(this.dateRange[0]) : '',
      this.dateRange.length > 0 ? Util.dateToString(this.dateRange[1]) : '').subscribe(res => {
        this.customerSort = res;
        this.t5 = res.length;
        this.publishChart.source(res, {
          value: {
            nice: false,
            alias: '销量（万）'
          }
        });
        this.publishChart.axis('label', {
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
        this.publishChart.interval().position('label*value').size(26).opacity(1).label('value', {
          textStyle: {
            fill: '#8d8d8d'
          },
          offset: 10
        });
        this.publishChart.render();
      });
  }

  getPubCustomer() {
    this.dashboardService.getPubCustomer(this.dateRange.length > 0 ? Util.dateToString(this.dateRange[0]) : '',
      this.dateRange.length > 0 ? Util.dateToString(this.dateRange[1]) : '').subscribe(res => {
        this.customerSort = res;
        this.t5 = res.length;
        this.publishChart.source(res, {
          value: {
            nice: false,
            alias: '销量（万）'
          }
        });
        this.publishChart.axis('label', {
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
        this.publishChart.interval().position('label*value').size(26).opacity(1).label('value', {
          textStyle: {
            fill: '#8d8d8d'
          },
          offset: 10
        });
        this.publishChart.render();
      });
  }

  onChange() {
    if (this.seriesInOut === 'purchase') {
      this.getPurCustomer();
    }
    if (this.seriesInOut === 'publish') {
      this.getPubCustomer();
    }
  }

  seriesInOutChange() {
    if (this.seriesInOut === 'purchase') {
      this.dateRange = [];
      // this.publishChart.clear();
      this.getPurCustomer();
    }
    if (this.seriesInOut === 'publish') {
      this.dateRange = [];
      // this.publishChart.clear();
      this.getPubCustomer();
    }
  }
}
