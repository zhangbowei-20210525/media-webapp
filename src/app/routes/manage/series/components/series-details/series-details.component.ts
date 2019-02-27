import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MessageService } from '@shared';
import { SeriesService } from '../../series.service';

@Component({
  selector: 'app-series-details',
  templateUrl: './series-details.component.html',
  styleUrls: ['./series-details.component.less']
})
export class SeriesDetailsComponent implements OnInit {

  category: string;
  id: number;
  seriesInfo: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: SeriesService,
    private message: MessageService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('sid');
        return this.service.getSeriesDetailsInfo(this.id);
      })
    ).subscribe(result => {
      this.seriesInfo = result;
    });
  }

}
