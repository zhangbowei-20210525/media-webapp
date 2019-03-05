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
  sif: boolean;

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
        const sif = params.get('sif');
        if (sif === 'show') {
             this.sif = true;
        }
        console.log(this.sif);
        return this.service.getSeriesDetailsInfo(this.id);
      })
    ).subscribe(result => {
      this.seriesInfo = result;
    });
  }

  tapeDetails () {
    this.service.getTapeList(this.id).subscribe(res => {
      const tapeId = res[0].id;
    this.router.navigate([`/manage/series/d/${this.id}/tape`, { tapeId: tapeId}]);
  });
  }

  showInfo() {
    this.sif = !this.sif;
  }

  categories() {
  }

}
