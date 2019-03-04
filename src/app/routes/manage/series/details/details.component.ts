import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { switchMap, filter } from 'rxjs/operators';
import { SeriesService } from '../series.service';
import { MessageService } from '@shared';

@Component({
  selector: 'app-series-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.less']
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
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
    });
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('sid');
        return this.service.getSeriesDetailsInfo(this.id);
      })
    ).subscribe(result => {
      this.seriesInfo = result;
    });
  }

  categories() {

  }

}
