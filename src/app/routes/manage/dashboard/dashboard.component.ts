import { Component, OnInit, ViewChild } from '@angular/core';
import * as G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { SeriesService } from '../series/series.service';
import { DashboardService } from './dashboard.service';
import { map } from 'rxjs/operators';
import { NzTreeNodeOptions, NzTreeComponent, NzTreeSelectComponent, NzTreeNode } from 'ng-zorro-antd';
import { TreeService, MessageService } from '@shared';
import { DashboardDto } from './dtos';
import { TranslateService } from '@ngx-translate/core';

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
  seriesCriteria: string;
  time: string;
  publicityData: any;
  publicityChart: any;
  seriesChart: any;
  pubType: string;
  publishChart: any;
  tapeType: string;
  tapeChart: any;
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
    this.getSeriesStatisticsInfo();
    this.getPublicityStatisticsInfo();
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
    // var _DataSet = DataSet,
    //   DataView = _DataSet.DataView;
    // var _G = G2,
    //   Chart = _G.Chart;
    // var ages = [
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
    // var dv = new DataView();
    // dv.source(this.data).transform({
    //   type: 'fold',
    //   fields: ages,
    //   key: 'age',
    //   value: 'population',
    //   retains: ['State']
    // }).transform({
    //   type: 'map',
    //   callback: function callback(obj) {
    //     var key = obj.age;
    //     var type = void 0;
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
    // var colorMap = {
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
      // const a = this.selectArea[0];
      // const b = this.selectArea[0].children[0];
      // const c = this.selectArea[0].children[0].children;
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

  getSeriesStatisticsInfo() {
    this.dashboardService.getSeriesStatistics('program_type').subscribe(res => {
      this.seriesChart = new G2.Chart({
        container: 'seriesStatistics',
        forceFit: true,
        width: 520,
        height: 360,
        // padding:  [ 0,  0,  0,  0]
      });
      this.seriesChart.source(res, {
        percent: {
          formatter: function formatter(val) {
            val = val + '%';
            return val;
          }
        }
      });
      this.seriesChart.coord('theta', {
        radius: 0.75,  // 设置半径，值范围为 0 至 1
        innerRadius: 0,  // 空心圆的半径，值范围为 0 至 1
        startAngle: -1 * Math.PI / 2,  // 极坐标的起始角度，单位为弧度
        endAngle: 3 * Math.PI / 2 // 极坐标的结束角度，单位为弧度
      });
      this.seriesChart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      this.seriesChart.intervalStack().position('percent').color('label').label('percent', {
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
      this.seriesChart.render();
    });
  }

  getPublicityStatisticsInfo() {
    this.dashboardService.getPublicityStatistics('day').subscribe(res => {
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
    this.dashboardService.getPublishStatistics('custom').subscribe(res => {
      this.publishChart = new G2.Chart({
        container: 'publishStatistics',
        forceFit: true,
        width: 520,
        height: 350,
      });
      this.publishChart.source(res);
      this.publishChart.scale('value', {
        tickCount: 4
      });
      this.publishChart.interval().position('label*value');
      this.publishChart.render();
    });
  }

  getTapeStatisticsInfo() {
    this.dashboardService.getTapeStatistics('publish').subscribe(res => {
      this.tapeChart = new G2.Chart({
        container: 'tapeStatistics',
        forceFit: true,
        width: 520,
        height: 350,
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
    if (this.seriesCriteria === 'investment_type') {
      this.dashboardService.getSeriesStatistics('investment_type').subscribe(res => {
        this.seriesChart.source(res, {
          percent: {
            formatter: function formatter(val) {
              val = val + '%';
              return val;
            }
          }
        });
        this.seriesChart.render();
      });
    }

    if (this.seriesCriteria === 'program_type') {
      this.dashboardService.getSeriesStatistics('program_type').subscribe(res => {
        this.seriesChart.source(res, {
          percent: {
            formatter: function formatter(val) {
              val = val + '%';
              return val;
            }
          }
        });
        this.seriesChart.render();
      });
    }
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
}
