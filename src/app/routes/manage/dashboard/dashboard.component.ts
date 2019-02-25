import { Component, OnInit } from '@angular/core';
import * as G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { SeriesService } from '../series/series.service';
import { DashboardService } from './dashboard.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  activeProject: string;
  showTable: number;
  timeFiltrate: string;
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
  statisticsSelectorYear = [];
  statisticsSelectorArea = [];
  statisticsSelectYear = [];
  statisticsSelectArea = [];
  allStatisticsChart: any;

  constructor(
    private dashboardService: DashboardService
  ) { }

  areaFiltrate: string[] = ['0-0-0'];
  nodes = [{
    title: '中国',
    value: '中国',
    key: '中国',
    children: [{
      title: '上海',
      value: '上海',
      key: '上海',
      isLeaf: true
    }]
  }, {
    title: '日本',
    value: '日本',
    key: '日本',
    children: [{
      title: '东京',
      value: '东京',
      key: '东京',
      isLeaf: true
    }, {
      title: '北海道',
      value: '北海道',
      key: '北海道',
      isLeaf: true
    }, {
      title: '新野',
      value: '新野',
      key: '新野',
      isLeaf: true
    }]
  }];
  values: any[] = null;
  ngOnInit() {
    this.seriesCriteria = 'investment_type';
    this.time = 'day';
    this.pubType = 'custom';
    this.tapeType = 'publish';
    this.activeProject = 'right';
    this.showTable = 1;
    this.dashboardService.getExpireInfo().pipe(map(m => {
      m.data.right.data.length = 5;
      m.data.publish_right.data.length = 5;
      m.data.payment.data.length = 5;
      m.data.receipt.data.length = 5;
      return m;
    })).subscribe(res => {
      this.right = res.data.right;
      this.publish_right = res.data.publish_right;
      this.payment = res.data.payment;
      this.receipt = res.data.receipt;
    });
    this.getSeriesStatisticsInfo();
    this.getPublicityStatisticsInfo();
    this.getPublishStatisticsInfo();
    this.getTapeStatisticsInfo();
    this.dashboardService.getActiveProject('right').subscribe(res => {
      this.activeProjectRight = res.data;
    });
    this.dashboardService.getAllStatistics(this.statisticsSelectYear, this.statisticsSelectArea).subscribe(res => {
      console.log(res);
      this.statisticsSelectorYear = res.data.meta.year_choices;
      this.statisticsSelectorArea = res.data.meta.area_number_choices;
      const dv = new DataSet.View().source(res.data.list);
      dv.transform({
        type: 'sort',
        callback: function callback(a, b) {
          return a.label - b.label;
        }
      });

      this.allStatisticsChart = new G2.Chart({
        container: 'allStatistics',
        forceFit: true,
        width: 1100,
        height: 425,
        padding: [10, 30, 80, 30]
      });
      this.allStatisticsChart.source(dv);
      this.allStatisticsChart.scale('label', {
        range: [0, 1]
      });
      this.allStatisticsChart.axis('label', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      });
      this.allStatisticsChart.axis('value', {
        label: {
          textStyle: {
            fill: '#aaaaaa'
          }
        }
      });
      this.allStatisticsChart.tooltip({
        shared: true,
      });
      this.allStatisticsChart.line().position('label*value').color('line').size('line', function (val) {
        return 2;
      }).opacity('line', function (val) {
        return 0.7;
      });
      this.allStatisticsChart.point().position('label*value').color('line').size('line', function (val) {
        return 0;
      }).style({
        lineWidth: 2
      });
      this.allStatisticsChart.render();
    });
  }

  getSeriesStatisticsInfo() {
    this.dashboardService.getSeriesStatistics('investment_type').subscribe(res => {
      this.seriesChart = new G2.Chart({
        container: 'seriesStatistics',
        forceFit: true,
        width: 520,
        height: 360,
        // padding:  [ 0,  0,  0,  0]
      });
      this.seriesChart.source(res.data, {
        percent: {
          formatter: function formatter(val) {
            val = val * 100 + '%';
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
      const dv = new DataSet.View().source(res.data);
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

  getPublishStatisticsInfo () {
    this.dashboardService.getPublishStatistics('custom').subscribe(res => {
      this.publishChart = new G2.Chart({
        container: 'publishStatistics',
        forceFit: true,
        width: 520,
        height: 350,
      });
      this.publishChart.source(res.data);
      this.publishChart.scale('value', {
        tickInterval: 20
      });
      this.publishChart.interval().position('label*value');
      this.publishChart.render();
    });
  }

  getTapeStatisticsInfo () {
    this.dashboardService.getTapeStatistics('publish').subscribe(res => {
      this.tapeChart = new G2.Chart({
        container: 'tapeStatistics',
        forceFit: true,
        width: 520,
        height: 350,
      });
      this.tapeChart.source(res.data);
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
        this.seriesChart.source(res.data, {
          percent: {
            formatter: function formatter(val) {
              val = val * 100 + '%';
              return val;
            }
          }
        });
        this.seriesChart.render();
      });
    }

    if (this.seriesCriteria === 'program_type') {
      this.dashboardService.getSeriesStatistics('program_type').subscribe(res => {
        this.seriesChart.source(res.data, {
          percent: {
            formatter: function formatter(val) {
              val = val * 100 + '%';
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
        const dv = new DataSet.View().source(res.data);
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
        const dv = new DataSet.View().source(res.data);
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
        const dv = new DataSet.View().source(res.data);
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
        this.publishChart.source(res.data);
        this.publishChart.render();
      });
    }
    if (this.pubType === 'right') {
      this.dashboardService.getPublishStatistics('right').subscribe(res => {
        this.publishChart.source(res.data);
        this.publishChart.render();
      });

    }
    if (this.pubType === 'area') {
      this.dashboardService.getPublishStatistics('area').subscribe(res => {
        this.publishChart.source(res.data);
        this.publishChart.render();
      });
    }
  }

  switchoverTape() {
    if (this.tapeType === 'publish') {
      this.dashboardService.getTapeStatistics('publish').subscribe(res => {
        this.tapeChart.source(res.data);
        this.tapeChart.render();
      });
    }
    if (this.tapeType === 'purchase') {
      this.dashboardService.getTapeStatistics('purchase').subscribe(res => {
        this.tapeChart.source(res.data);
        this.tapeChart.render();
      });
    }
  }

  activeProjects() {
    if (this.activeProject === 'right') {
      this.showTable = 1;
      this.dashboardService.getActiveProject('right').subscribe(res => {
        this.activeProjectRight = res.data;
      });
    }
    if (this.activeProject === 'publish_right') {
      this.showTable = 2;
      this.dashboardService.getActiveProject('publish_right').subscribe(res => {
        this.activeProjectPubRight = res.data;
      });
    }
    if (this.activeProject === 'publicity') {
      this.showTable = 3;
      this.dashboardService.getActiveProject('publicity').subscribe(res => {
        this.activeProjectPublicity = res.data;
      });
    }
    if (this.activeProject === 'source') {
      this.showTable = 4;
      this.dashboardService.getActiveProject('source').subscribe(res => {
        this.activeProjectSource = res.data;
      });
    }
  }


  areaChange(event) {
    this.statisticsSelectYear = event;
  }

  yearChange(event) {
    this.statisticsSelectArea = event;
  }

}
