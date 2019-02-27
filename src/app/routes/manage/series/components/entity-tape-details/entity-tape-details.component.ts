import { Component, OnInit } from '@angular/core';
import { SeriesService } from '../../series.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-entity-tape-details',
  templateUrl: './entity-tape-details.component.html',
  styleUrls: ['./entity-tape-details.component.less']
})
export class EntityTapeDetailsComponent implements OnInit {

  id: number;
  tapeDetailsInfo: any;

  constructor(
    private seriesService: SeriesService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('tapeId');
        return this.seriesService.getOnlineInfo(this.id);
      })
    ).subscribe(res => {
     this.tapeDetailsInfo = res.data;
    });
  }
}
