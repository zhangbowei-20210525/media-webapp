import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeriesService } from '../series.service';

@Component({
  selector: 'app-series-config',
  templateUrl: './series-config.component.html',
  styleUrls: ['./series-config.component.less']
})
export class SeriesConfigComponent implements OnInit {

  active1 = true;
  active2 = true;
  active3 = true;
  active4 = true;

  programTypes = [
    { raw: '电视剧', real: '电视剧', count: 0, over: false },
    { raw: '电影', real: '电影', count: 0, over: false },
    { raw: '动画片', real: '动画片', count: 0, over: false },
  ];

  seriesTypes = [];
  investmentTypes = [];
  themes = [];


  constructor(
    private router: Router,
    private service: SeriesService,
  ) { }

  ngOnInit() {
    this.service.getTypes('program_types').subscribe(result => {
      result.forEach(f => {
        this.seriesTypes.push({
          id: f.id,
          raw: f.field_value,
          deletable: f.deletable,
          is_default: f.is_default,
        });
      });
      console.log(this.seriesTypes);
    });
    this.service.getTypes('investment_types').subscribe(result => {
      result.forEach(f => {
        this.investmentTypes.push({
          id: f.id,
          raw: f.field_value,
          deletable: f.deletable,
          is_default: f.is_default,
        });
      });
      console.log(this.seriesTypes);
    });
    this.service.getTypes('themes').subscribe(result => {
      result.forEach(f => {
        this.themes.push({
          id: f.id,
          raw: f.field_value,
          deletable: f.deletable,
          is_default: f.is_default,
        });
      });
      console.log(this.seriesTypes);
    });
  }

  goBack() {
    this.router.navigate([`/manage/series`]);
  }

}
