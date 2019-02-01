import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SeriesService } from '../series.service';
import { MessageService } from '@shared';

@Component({
  selector: 'app-series-details',
  templateUrl: './series-details.component.html',
  styleUrls: ['./series-details.component.less']
})
export class SeriesDetailsComponent implements OnInit {

  category: string;
  si: string;

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

  id: number;
  seriesType: string;
  seriesInfo: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('sid');
        return this.seriesService.getSeriesDetailsInfo(this.id);
      })
    ).subscribe(res => {
      this.seriesInfo = res;
      this.si = res.introduction;
    }, error => {
      if (error.message) {
        this.message.error(error.message);
      }
    });
  }

  categories() {
    if (this.category === 'publicities') {
      this.router.navigate([`/manage/series/series-details/${this.id}/series-details-publicity`]);
    }
    if (this.category === 'tapes') {
      this.router.navigate([`/manage/series/series-details/${this.id}/series-details-tape`]);
    }
    if (this.category === 'copyrights') {
      this.router.navigate([`/manage/series/series-details/${this.id}/series-details-copyright`]);
    }
  }

}
