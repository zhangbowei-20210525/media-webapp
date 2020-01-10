import { Component, OnInit } from '@angular/core';
import { ChoreographyService } from '../choreography.service';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginationDto } from '@shared';

@Component({
  selector: 'app-theatre',
  templateUrl: './theatre.component.html',
  styleUrls: ['./theatre.component.less']
})
export class TheatreComponent implements OnInit {

  listOfData = [];
  isLoaded = false;
  isLoading = false;
  pagination = { page: 1, page_size: 10 } as PaginationDto;

  constructor(
    private service: ChoreographyService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.service.eventEmit.subscribe((value: any) => {
      if (value.type === 'theatre' && value.method === 'refresh') {
        this.filtrate();
      }
    });
    this.filtrate();
  }

  filtrate() {
    this.isLoading = true;
    this.service.getTheatreList().pipe(finalize(() => {
      this.isLoading = false;
      this.isLoaded = true;
    })).subscribe(res => {
      this.listOfData = this.getListOfData(res);
    });
  }

  getListOfData(res: any[]) {
    const data = [];
    res.forEach(f => {
      let index = 0;
      if (f.columns.length === 0) {
        data.push({
          index: index++,
          channelId: f.id,
          channelName: f.name,
          count: f.columns.length,
          isHasTheatre: false
        });
      } else {
        f.columns.forEach(x => {
          data.push({
            index: index++,
            channelId: f.id,
            channelName: f.name,
            theatreId: x.id,
            theatreName: x.name,
            air_date: x.air_date,
            isHasTheatre: true,
            broadcast_time: x.broadcast_time,
            weekday_schedules: x.weekday_schedules,
            count: f.columns.length
          });
        });
      }
    });
    return data;
  }

  deleteTheatre(id: number) {
    this.service.deleteTheatre(id).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.filtrate();
    });
  }

  deleteChannel(id: number) {
    this.service.deleteChannel(id).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.filtrate();
    });
  }



}
