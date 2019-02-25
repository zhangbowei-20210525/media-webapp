import { Component, OnInit } from '@angular/core';
import { AddTapeComponent } from '../add-tape/add-tape.component';
import { NzModalService } from 'ng-zorro-antd';
import { SeriesService } from '../../series.service';
import { switchMap } from 'rxjs/operators';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { TapeDto } from '../../dtos/tape.dto';

@Component({
  selector: 'app-series-details-tape',
  templateUrl: './series-details-tape.component.html',
  styleUrls: ['./series-details-tape.component.less']
})
export class SeriesDetailsTapeComponent implements OnInit {

  isId: number;
  id: number;
  tapesList = [];

  constructor(
    private modalService: NzModalService,
    private seriesService: SeriesService,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.isId = 0;
    this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.id = +params.get('sid');
        return this.seriesService.getTapeList(this.id);
      })
    ).subscribe(res => {
     this.tapesList = res.data;
    });
  }

  pitchOn(id: number) {
    this.router.navigate([`/manage/series/series-details/${this.id}/series-details-tape/tape-details`, { tapeId: id }]);
    this.isId = id;
  }

  addTape() {
      this.modalService.create({
        nzTitle: `添加母带`,
        nzContent: AddTapeComponent,
        nzComponentParams: { id: this.id },
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: 800,
        nzOnOk: this.addTapeAgreed
      });
  }

  addTapeAgreed = (component: AddTapeComponent) => new Promise((resolve) => {
    component.formSubmit()
      .subscribe(res => {
        this.message.success(this.translate.instant('global.add-success'));
        this.seriesService.getTapeList(this.id).subscribe(t => {
         this.tapesList = t.data;
        });
        resolve();
      }, error => {
        if (error.message) {
          this.message.error(error.message);
        }
      });
  })
}
