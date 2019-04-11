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
  activeProjectRight = [];
  activeProjectPubRight = [];
  activeProjectPublicity = [];
  activeProjectSource = [];
  statisticsSelectYear = [];
  statisticsSelectArea = [];
  allStatisticsChart: any;
  allStatistics: NzTreeNodeOptions[];
  checkedAreaCode = [];
  timeType = 'quarter';
  data = [{
    company: 'Apple',
    type: '整体',
    value: 30
  }, {
    company: 'Facebook',
    type: '整体',
    value: 35
  }, {
    company: 'Google',
    type: '整体',
    value: 28
  }, {
    company: 'Apple',
    type: '非技术岗',
    value: 40
  }, {
    company: 'Facebook',
    type: '非技术岗',
    value: 65
  }, {
    company: 'Google',
    type: '非技术岗',
    value: 47
  }, {
    company: 'Apple',
    type: '技术岗',
    value: 23
  }, {
    company: 'Facebook',
    type: '技术岗',
    value: 18
  }, {
    company: 'Google',
    type: '技术岗',
    value: 20
  }, {
    company: 'Apple',
    type: '技术岗',
    value: 35
  }, {
    company: 'Facebook',
    type: '技术岗',
    value: 30
  }, {
    company: 'Google',
    type: '技术岗',
    value: 25
  }];
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

  getStatisticsSelectYear(origins: DashboardDto[]): NzTreeNodeOptions[] {
    return this.ts.getNzTreeNodes(origins, item => ({
      title: item.name,
      key: item.code,
      isLeaf: !!item.children && item.children.length < 1,
      selectable: true,
      expanded: true,
      disableCheckbox: false,
      checked: false
    }));
  }

  getAllStatisticsInfo() {
    this.dashboardService.getAllStatistics('', '').subscribe(res => {
      this.statisticsSelectArea = this.getStatisticsSelectYear(res.meta.area_number_choices);
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
      console.log(res);
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
      console.log(this.seriesChart.source(res));
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
        percent = percent * 100 + '%';
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
        tickCount: 10
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

  areaChange(event) {
    this.checkedAreaCode = event;
    if (this.timeFiltrate === undefined) {
      this.timeFiltrate = [''];
    }
    if(this.timeType === 'annual') {
      if (event.length < 6) {
        this.dashboardService.getAnnualStatistics(this.checkedAreaCode).subscribe(res => {
          this.allStatisticsChart.source(res.list);
          this.allStatisticsChart.render();
        });
      } else {
        this.message.warning(this.translate.instant('app.home-page.statistics-operation-instruction'));
        this.checkedAreaCode.splice(this.timeFiltrate.length - 1, 1)
      }} else {
    if (event.length < 6) {
      this.dashboardService.getAllStatistics(this.timeFiltrate, event).subscribe(res => {
        this.statisticsSelectYear = this.getStatisticsSelectYear(res.meta.area_number_choices);
        this.statisticsSelectYear = res.meta.year_choices;
        this.allStatisticsChart.source(res.list);
        this.allStatisticsChart.render();
      });
    } else {
      this.message.warning(this.translate.instant('app.home-page.statistics-operation-instruction'));
      this.checkedAreaCode.splice(this.timeFiltrate.length - 1, 1)
    }}
  }

  yearChange(event) {
    this.timeFiltrate = event;
    if (this.checkedAreaCode === undefined) {
      this.checkedAreaCode = [''];
    }
    this.dashboardService.getAllStatistics(this.timeFiltrate, this.checkedAreaCode).subscribe(res => {
      this.statisticsSelectYear = this.getStatisticsSelectYear(res.meta.area_number_choices);
      this.statisticsSelectYear = res.meta.year_choices;
      this.allStatisticsChart.source(res.list);
      this.allStatisticsChart.render();
    }); 
  }

  timeTypeChange(event) {
    this.timeType = event;
    if (this.timeType === 'annual') {
      this.dashboardService.getAnnualStatistics(this.checkedAreaCode).subscribe(res => {
        console.log(res.list);
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
      this.dashboardService.getAllStatistics(this.timeFiltrate, this.checkedAreaCode).subscribe(res => {
        this.statisticsSelectYear = this.getStatisticsSelectYear(res.meta.area_number_choices);
        this.statisticsSelectYear = res.meta.year_choices;
        this.allStatisticsChart.source(res.list);
        this.allStatisticsChart.render();
      });
    }
  }
}
