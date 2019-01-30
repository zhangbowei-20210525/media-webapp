import { Component, OnInit } from '@angular/core';
import * as G2 from '@antv/g2';
import DataSet from '@antv/data-set';
import { SeriesService } from '../series/series.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  activeProject: string;
  showTable: number;

  constructor(
    private seriesService: SeriesService
  ) { }

  dataSet = [
    {
      key    : '1',
      name   : 'John Brown',
      age    : 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key    : '2',
      name   : 'Jim Green',
      age    : 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key    : '3',
      name   : 'Joe Black',
      age    : 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

   data = [{
    item:  '事例一',
    count:  40,
    percent:  0.4
  },  {
    item:  '事例二',
    count:  21,
    percent:  0.21
  },  {
    item:  '事例三',
    count:  17,
    percent:  0.17
  },  {
    item:  '事例四',
    count:  13,
    percent:  0.13
  },  {
    item:  '事例五',
    count:  9,
    percent:  0.09
  }];
  // tslint:disable-next-line:max-line-length
  data1 = [{'country': 'Brazil', 'year': '2015', 'value': 1.705}, {'country': 'Brazil', 'year': '2010', 'value': 1.78}, {'country': 'Brazil', 'year': '2005', 'value': 1.86}, {'country': 'Brazil', 'year': '2000', 'value': 2.13}, {'country': 'Brazil', 'year': '1995', 'value': 2.47}, {'country': 'Brazil', 'year': '1990', 'value': 2.72}, {'country': 'Brazil', 'year': '1985', 'value': 3.16}, {'country': 'Brazil', 'year': '1980', 'value': 3.82}, {'country': 'Brazil', 'year': '1975', 'value': 4.28}, {'country': 'Brazil', 'year': '1970', 'value': 4.68}, {'country': 'Brazil', 'year': '1965', 'value': 5.37}, {'country': 'Brazil', 'year': '1960', 'value': 6}, {'country': 'Brazil', 'year': '1955', 'value': 6.05}, {'country': 'Brazil', 'year': '1950', 'value': 6.1}, {'country': 'China', 'year': '2015', 'value': 1.635}, {'country': 'China', 'year': '2010', 'value': 1.6}, {'country': 'China', 'year': '2005', 'value': 1.58}, {'country': 'China', 'year': '2000', 'value': 1.55}, {'country': 'China', 'year': '1995', 'value': 1.51}, {'country': 'China', 'year': '1990', 'value': 1.895}, {'country': 'China', 'year': '1985', 'value': 2.725}, {'country': 'China', 'year': '1980', 'value': 2.55}, {'country': 'China', 'year': '1975', 'value': 3}, {'country': 'China', 'year': '1970', 'value': 4.77}, {'country': 'China', 'year': '1965', 'value': 6.25}, {'country': 'China', 'year': '1960', 'value': 6.2}, {'country': 'China', 'year': '1955', 'value': 5.4}, {'country': 'China', 'year': '1950', 'value': 6.025}, {'country': 'France', 'year': '2015', 'value': 1.973}, {'country': 'France', 'year': '2010', 'value': 1.982}, {'country': 'France', 'year': '2005', 'value': 1.978}, {'country': 'France', 'year': '2000', 'value': 1.882}, {'country': 'France', 'year': '1995', 'value': 1.762}, {'country': 'France', 'year': '1990', 'value': 1.715}, {'country': 'France', 'year': '1985', 'value': 1.805}, {'country': 'France', 'year': '1980', 'value': 1.865}, {'country': 'France', 'year': '1975', 'value': 1.87}, {'country': 'France', 'year': '1970', 'value': 2.3}, {'country': 'France', 'year': '1965', 'value': 2.639}, {'country': 'France', 'year': '1960', 'value': 2.832}, {'country': 'France', 'year': '1955', 'value': 2.689}, {'country': 'France', 'year': '1950', 'value': 2.747}, {'country': 'India', 'year': '2015', 'value': 2.303}, {'country': 'India', 'year': '2010', 'value': 2.438}, {'country': 'India', 'year': '2005', 'value': 2.796}, {'country': 'India', 'year': '2000', 'value': 3.14}, {'country': 'India', 'year': '1995', 'value': 3.483}, {'country': 'India', 'year': '1990', 'value': 3.833}, {'country': 'India', 'year': '1985', 'value': 4.266}, {'country': 'India', 'year': '1980', 'value': 4.682}, {'country': 'India', 'year': '1975', 'value': 4.974}, {'country': 'India', 'year': '1970', 'value': 5.41}, {'country': 'India', 'year': '1965', 'value': 5.723}, {'country': 'India', 'year': '1960', 'value': 5.89}, {'country': 'India', 'year': '1955', 'value': 5.896}, {'country': 'India', 'year': '1950', 'value': 5.903}, {'country': 'Japan', 'year': '2015', 'value': 1.478}, {'country': 'Japan', 'year': '2010', 'value': 1.409}, {'country': 'Japan', 'year': '2005', 'value': 1.339}, {'country': 'Japan', 'year': '2000', 'value': 1.298}, {'country': 'Japan', 'year': '1995', 'value': 1.369}, {'country': 'Japan', 'year': '1990', 'value': 1.476}, {'country': 'Japan', 'year': '1985', 'value': 1.65}, {'country': 'Japan', 'year': '1980', 'value': 1.762}, {'country': 'Japan', 'year': '1975', 'value': 1.831}, {'country': 'Japan', 'year': '1970', 'value': 2.134}, {'country': 'Japan', 'year': '1965', 'value': 2.04}, {'country': 'Japan', 'year': '1960', 'value': 2.03}, {'country': 'Japan', 'year': '1955', 'value': 2.17}, {'country': 'Japan', 'year': '1950', 'value': 2.96}, {'country': 'Nepal', 'year': '2015', 'value': 2.083}, {'country': 'Nepal', 'year': '2010', 'value': 2.318}, {'country': 'Nepal', 'year': '2005', 'value': 2.963}, {'country': 'Nepal', 'year': '2000', 'value': 3.636}, {'country': 'Nepal', 'year': '1995', 'value': 4.407}, {'country': 'Nepal', 'year': '1990', 'value': 4.97}, {'country': 'Nepal', 'year': '1985', 'value': 5.329}, {'country': 'Nepal', 'year': '1980', 'value': 5.62}, {'country': 'Nepal', 'year': '1975', 'value': 5.795}, {'country': 'Nepal', 'year': '1970', 'value': 5.866}, {'country': 'Nepal', 'year': '1965', 'value': 5.959}, {'country': 'Nepal', 'year': '1960', 'value': 5.959}, {'country': 'Nepal', 'year': '1955', 'value': 5.959}, {'country': 'Nepal', 'year': '1950', 'value': 5.959}, {'country': 'Norway', 'year': '2015', 'value': 1.827}, {'country': 'Norway', 'year': '2010', 'value': 1.819}, {'country': 'Norway', 'year': '2005', 'value': 1.924}, {'country': 'Norway', 'year': '2000', 'value': 1.806}, {'country': 'Norway', 'year': '1995', 'value': 1.862}, {'country': 'Norway', 'year': '1990', 'value': 1.886}, {'country': 'Norway', 'year': '1985', 'value': 1.8}, {'country': 'Norway', 'year': '1980', 'value': 1.687}, {'country': 'Norway', 'year': '1975', 'value': 1.81}, {'country': 'Norway', 'year': '1970', 'value': 2.35}, {'country': 'Norway', 'year': '1965', 'value': 2.8}, {'country': 'Norway', 'year': '1960', 'value': 2.898}, {'country': 'Norway', 'year': '1955', 'value': 2.837}, {'country': 'Norway', 'year': '1950', 'value': 2.602}, {'country': 'Spain', 'year': '2015', 'value': 1.391}, {'country': 'Spain', 'year': '2010', 'value': 1.329}, {'country': 'Spain', 'year': '2005', 'value': 1.394}, {'country': 'Spain', 'year': '2000', 'value': 1.29}, {'country': 'Spain', 'year': '1995', 'value': 1.19}, {'country': 'Spain', 'year': '1990', 'value': 1.28}, {'country': 'Spain', 'year': '1985', 'value': 1.46}, {'country': 'Spain', 'year': '1980', 'value': 1.88}, {'country': 'Spain', 'year': '1975', 'value': 2.55}, {'country': 'Spain', 'year': '1970', 'value': 2.85}, {'country': 'Spain', 'year': '1965', 'value': 2.84}, {'country': 'Spain', 'year': '1960', 'value': 2.81}, {'country': 'Spain', 'year': '1955', 'value': 2.7}, {'country': 'Spain', 'year': '1950', 'value': 2.53}, {'country': 'Swaziland', 'year': '2015', 'value': 3.014}, {'country': 'Swaziland', 'year': '2010', 'value': 3.3}, {'country': 'Swaziland', 'year': '2005', 'value': 3.75}, {'country': 'Swaziland', 'year': '2000', 'value': 4}, {'country': 'Swaziland', 'year': '1995', 'value': 4.45}, {'country': 'Swaziland', 'year': '1990', 'value': 5.2}, {'country': 'Swaziland', 'year': '1985', 'value': 6}, {'country': 'Swaziland', 'year': '1980', 'value': 6.5}, {'country': 'Swaziland', 'year': '1975', 'value': 6.733}, {'country': 'Swaziland', 'year': '1970', 'value': 6.866}, {'country': 'Swaziland', 'year': '1965', 'value': 6.849}, {'country': 'Swaziland', 'year': '1960', 'value': 6.75}, {'country': 'Swaziland', 'year': '1955', 'value': 6.7}, {'country': 'Swaziland', 'year': '1950', 'value': 6.7}, {'country': 'U.S.', 'year': '2015', 'value': 1.886}, {'country': 'U.S.', 'year': '2010', 'value': 1.877}, {'country': 'U.S.', 'year': '2005', 'value': 2.05}, {'country': 'U.S.', 'year': '2000', 'value': 2.042}, {'country': 'U.S.', 'year': '1995', 'value': 1.996}, {'country': 'U.S.', 'year': '1990', 'value': 2.03}, {'country': 'U.S.', 'year': '1985', 'value': 1.915}, {'country': 'U.S.', 'year': '1980', 'value': 1.804}, {'country': 'U.S.', 'year': '1975', 'value': 1.772}, {'country': 'U.S.', 'year': '1970', 'value': 2.029}, {'country': 'U.S.', 'year': '1965', 'value': 2.543}, {'country': 'U.S.', 'year': '1960', 'value': 3.234}, {'country': 'U.S.', 'year': '1955', 'value': 3.582}, {'country': 'U.S.', 'year': '1950', 'value': 3.311}, {'country': 'Yemen', 'year': '2015', 'value': 3.837}, {'country': 'Yemen', 'year': '2010', 'value': 4.4}, {'country': 'Yemen', 'year': '2005', 'value': 5}, {'country': 'Yemen', 'year': '2000', 'value': 5.9}, {'country': 'Yemen', 'year': '1995', 'value': 6.8}, {'country': 'Yemen', 'year': '1990', 'value': 8.2}, {'country': 'Yemen', 'year': '1985', 'value': 8.8}, {'country': 'Yemen', 'year': '1980', 'value': 8.8}, {'country': 'Yemen', 'year': '1975', 'value': 8.6}, {'country': 'Yemen', 'year': '1970', 'value': 7.9}, {'country': 'Yemen', 'year': '1965', 'value': 7.8}, {'country': 'Yemen', 'year': '1960', 'value': 7.6}, {'country': 'Yemen', 'year': '1955', 'value': 7.4}, {'country': 'Yemen', 'year': '1950', 'value': 7.35}];


  data2 = [{
    year: '1951 年',
    sales: 38
  }, {
    year: '1952 年',
    sales: 52
  }, {
    year: '1956 年',
    sales: 61
  }, {
    year: '1957 年',
    sales: 145
  }, {
    year: '1958 年',
    sales: 48
  }, {
    year: '1959 年',
    sales: 38
  }, {
    year: '1960 年',
    sales: 38
  }, {
    year: '1962 年',
    sales: 38
  }];

  data3 = [{
    item: '事例一',
    count: 40,
    percent: 0.4
  }, {
    item: '事例二',
    count: 21,
    percent: 0.21
  }, {
    item: '事例三',
    count: 17,
    percent: 0.17
  }, {
    item: '事例四',
    count: 13,
    percent: 0.13
  }, {
    item: '事例五',
    count: 9,
    percent: 0.09
  }];
  ngOnInit() {
   const  aa = { page: 1, count: 10, page_size: 10 } as any;
    this.seriesService.getSeries(aa).subscribe(res => {
      console.log('123');
      // this.seriesList = res.list;
      // this.seriesPagination = res.pagination;
    });
    this.showTable = 1;
   const chart = new G2.Chart({
      container:  'mountNode',
      forceFit:  true,
      width:  520,
      height:  360,
      // padding:  [ 0,  0,  0,  0]
    });
    chart.source(this.data,  {
      percent:  {
        formatter:  function formatter(val) {
          val = val * 100 + '%';
          return val;
        }
      }
    });
    chart.coord('theta', {
      radius:  0.75,  // 设置半径，值范围为 0 至 1
      innerRadius:  0,  // 空心圆的半径，值范围为 0 至 1
      startAngle:  -1 * Math.PI / 2,  // 极坐标的起始角度，单位为弧度
      endAngle:  3 * Math.PI / 2 // 极坐标的结束角度，单位为弧度
    });
    chart.tooltip({
      showTitle: false,
      itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    chart.intervalStack().position('percent').color('item').label('percent', {
      formatter: function formatter(val, item) {
        return item.point.item + ': ' + val;
      }
    }).tooltip('item*percent', function(item, percent) {
      percent = percent * 100 + '%';
      return {
        name: item,
        value: percent
      };
    }).style({
      lineWidth: 1,
      stroke: '#fff'
    });
    chart.render();



    const dv = new DataSet.View().source(this.data1);
     dv.transform({
      type: 'sort',
      callback: function callback(a, b) {
        return a.year - b.year;
      }
    });

    const chart1 = new G2.Chart({
      container:  'mountNode1',
      forceFit:  true,
      width: 520.,
      height: 300,
      padding:  [10,  30,  80,  30]
    });
    chart1.source(dv);
    chart1.scale('year',  {
      range:  [0,  1]
    });
    chart1.axis('year',  {
      label:  {
        textStyle:  {
          fill:  '#aaaaaa'
        }
      }
    });
    chart1.axis('value',  {
      label:  {
        textStyle:  {
          fill:  '#aaaaaa'
        }
      }
    });
    chart1.tooltip({
      shared:  true,
    });
    chart1.line().position('year*value').color('country').size('country',  function(val) {
      return 2;
    }).opacity('country',  function(val) {
      return 0.7;
    });
    chart1.point().position('year*value').color('country').size('country',  function(val) {
      return 0;
    }).style({
      lineWidth:  2
    });
    chart1.render();


    const chart2 = new G2.Chart({
      container: 'mountNode2',
      forceFit: true,
      width: 520,
      height: 350,

    });
    chart2.source(this.data2);
    chart2.scale('sales', {
      tickInterval: 20
    });
    chart2.interval().position('year*sales');
    chart2.render();



    const chart3 = new G2.Chart({
      container: 'mountNode3',
      forceFit: true,
      width:  520,
      height:  360,
      animate: false
    });
    chart3.source(this.data3, {
      percent: {
        formatter: function formatter(val) {
          val = val * 100 + '%';
          return val;
        }
      }
    });
    chart3.coord('theta', {
      radius:  0.75,  // 设置半径，值范围为 0 至 1
      innerRadius:  0.6,  // 空心圆的半径，值范围为 0 至 1
      startAngle:  -1 * Math.PI / 2,  // 极坐标的起始角度，单位为弧度
      endAngle:  3 * Math.PI / 2 // 极坐标的结束角度，单位为弧度
    });
    chart3.tooltip({
      showTitle: false,
      itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    // 辅助文本
    chart3.guide().html({
      position: ['50%', '50%'],
      // tslint:disable-next-line:max-line-length
      html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">主机<br><span style="color:#8c8c8c;font-size:20px">200</span>台</div>',
      alignX: 'middle',
      alignY: 'middle'
    });
    const interval = chart3.intervalStack().position('percent').color('item').label('percent', {
      formatter: function formatter(val, item) {
        return item.point.item + ': ' + val;
      }
    }).tooltip('item*percent', function(item, percent) {
      percent = percent * 100 + '%';
      return {
        name: item,
        value: percent
      };
    }).style({
      lineWidth: 1,
      stroke: '#fff'
    });
    chart3.render();


}

activeProjects() {
  if ( this.activeProject === 'programRights' ) {
    this.showTable = 1;
  }
  if ( this.activeProject === 'pubRights' ) {
    this.showTable = 2;
  }
  if ( this.activeProject === 'publicitiesMaterial' ) {
    this.showTable = 3;
  }
  if ( this.activeProject === 'tapesManage' ) {
    this.showTable = 4;
  }
}

}
