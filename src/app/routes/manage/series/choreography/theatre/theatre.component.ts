import { Component, OnInit } from '@angular/core';
import { ChoreographyService } from '../choreography.service';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-theatre',
  templateUrl: './theatre.component.html',
  styleUrls: ['./theatre.component.less']
})
export class TheatreComponent implements OnInit {

  listOfData = [];
  isLoaded = false;
  isLoading = false;

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
      f.columns.forEach(x => {
        data.push({
          index: index++,
          channelId: f.id,
          channelName: f.name,
          theatreId: x.id,
          theatreName: x.name,
          air_date: x.air_date,
          broadcast_time: x.broadcast_time,
          weekday_schedules: x.weekday_schedules,
          count: f.columns.length
        });
      });
    });
    console.log(data);
    return data;
  }

  deleteChannel(id: number) {
    this.service.deleteChannel(id).subscribe(result => {
      this.message.success(this.translate.instant('global.delete-successfully'));
      this.filtrate();
    });
  }



}
