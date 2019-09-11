import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChoreographyComponent } from '../../choreography.component';
import { ChoreographyService } from '../../choreography.service';
import { Observable, from } from 'rxjs';
import { Util, ReactiveBase, FormControlService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-theatre',
  templateUrl: './add-theatre.component.html',
  styleUrls: ['./add-theatre.component.less']
})
export class AddTheatreComponent implements OnInit {

  validateForm: FormGroup;
  broadcastEpisodes: ReactiveBase<any>[][];
  dateMode = 'time';
  broadcastEpisodesForm: FormGroup;


  episode1: number;
  episode2: number;
  episode3: number;
  episode4: number;
  episode5: number;
  episode6: number;
  episode7: number;
  disabled = false;
  listOfData = [];
  weekday_schedules = [];
  isRepeat: boolean;
  id = 0;
  oldlist = [];
  weeks = [];
  data = [];
  oldWeeks = [];
  channels = [];
  theatres = [];
  channelOptions = [];
  // seriesOption = [];
  marks: any = {
    0: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    7: '星期日',
  };

  constructor(
    private fb: FormBuilder,
    private service: ChoreographyService,
    private fcs: FormControlService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      channel: [null, [Validators.required]],
      theatre: [null, [Validators.required]],
      premiereTime: [null, [Validators.required]],
      startBroadcastTime: [null, [Validators.required]],
      broadcastDate: [[1, 2], [Validators.required]],
      episodes: [null, [Validators.required]],
      // series: [null, [Validators.required]],
      // currentBroadcastDate: [null, [Validators.required]],
      // start_episode: [null, [Validators.required]],
      // end_episode: [null, [Validators.required]],
      // num: [null, [Validators.required]],
    });
    this.service.getTheatreList().subscribe(res => {
      this.data = res;
      this.data.forEach(x => {
        this.channels.push(x.name);
      });
    });
    // this.service.getSeriesList().subscribe(res => this.seriesOption = res.list);
  }

  handleDateOpenChange(open: boolean): void {
    if (open) {
      this.dateMode = 'time';
    }
  }

  handleDatePanelChange(mode: string): void {
    console.log('handleDatePanelChange: ', mode);
  }

  onChannelInput(value: string) {
    this.channelOptions = this.channels.filter(item => item.indexOf(value) >= 0);
    console.log(this.channelOptions);
  }

  channelChange() {
    const channel = this.data.filter(f => f.name === this.validateForm.get('channel').value);
    if (channel.length > 0) {
      channel[0].columns.forEach(f => {
        this.theatres.push(f.name);
      });
    }
  }

  // seriesChange() {
  //   const series = this.seriesOption.filter(f => {
  //     return this.validateForm.get('series').value === f.id;
  //   });
  //   if (series[0].episode === null || series[0].episode === 0) {
  //     this.validateForm.get('num').reset();
  //     this.disabled = false;
  //   } else {
  //     this.validateForm.get('num').setValue(series[0].episode);
  //     this.disabled = true;
  //   }
  // }

  validation() {
    const form = this.validateForm;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
    return form.valid;
  }

  conversion(nums: any[]) {
    const arr = [];
    for (let i = nums[0]; i <= nums[1]; i++) {
      arr.push(i);
    }
    return arr;
  }

  addBroadcastMethod() {
    if (this.validateForm.get('episodes').value !== null) {
      if (this.oldWeeks.length === 0) {
        this.conversion(this.validateForm.get('broadcastDate').value).forEach(f => {
          this.oldWeeks.push(f);
        });
        this.oldWeeks.forEach(f => this.weeks.push(f));
        this.isRepeat = false;
      } else {
        const a = this.conversion(this.validateForm.get('broadcastDate').value);
        const b = [];
        this.oldWeeks.forEach(f => {
          b.push(a.indexOf(f));
        });
        if (b.every(s => s === -1) === true) {
          this.conversion(this.validateForm.get('broadcastDate').value).forEach(f => {
            this.oldWeeks.push(f);
          });
          this.conversion(this.validateForm.get('broadcastDate').value).forEach(f => {
            this.weeks.push(f);
          });
          // this.weeks.push(this.validateForm.get('broadcastDate').value[0], this.validateForm.get('broadcastDate').value[1]);
          this.isRepeat = false;
        }
        if (b.every(s => s === -1) === false) {
          this.isRepeat = true;
        }
      }
      // for (let i = this.validateForm.get('broadcastDate').value[0];
      //   i < this.validateForm.get('broadcastDate').value[1] + 1;
      //   i++) {
      //   if (this.oldWeeks.indexOf(this.validateForm.get('broadcastDate').value[0]) > -1 ||
      //     this.oldWeeks.indexOf(this.validateForm.get('broadcastDate').value[1]) > -1) {
      //     this.isRepeat = true;
      //   } else {
      //     this.weeks.push(i);
      //     this.isRepeat = false;
      //   }
      // }
      if (this.isRepeat === false) {
        // this.oldWeeks.push(this.weeks[0], this.weeks[this.weeks.length - 1]);
        if (this.listOfData.length === 0) {
          this.listOfData = [
            {
              weeks: this.weeks,
              episode: this.validateForm.get('episodes').value
            }
          ];
        } else {
          this.listOfData = [
            ...this.listOfData,
            {
              weeks: this.weeks,
              episode: this.validateForm.get('episodes').value
            }
          ];
        }
        this.weeks = [];
      } else {
        this.message.warning(this.translate.instant('global.not-choose-repeat-week'));
      }
      this.listOfData.filter(f => f.startWeek === 1);
    } else {
      this.message.warning(this.translate.instant('global.please-select-episode'));
    }
  }

  deleteListOfData() {
    this.listOfData = [];
    this.oldWeeks = [];
    this.weekday_schedules = [];
  }

  deleteBroadcastMethod(id: string): void {
    this.listOfData = [];
  }

  // onBroadcastMethodChange(value: string) {
  //   const count = parseInt(value, 10);
  //   if (count >= 0) {
  //     this.broadcastEpisodes = this.service.getBroadcastEpisodes(count);
  //     const fg = {};
  //     this.broadcastEpisodes.map(p => this.fcs.toFormGroup(p)).forEach(p => {
  //       const c = p.controls;
  //       for (const key in c) {
  //         if (c.hasOwnProperty(key)) {
  //           fg[key] = c[key];
  //         }
  //       }
  //     });
  //     console.log(this.broadcastEpisodes);
  //     this.broadcastEpisodesForm = this.fb.group(fg);
  //   }
  // }

  submit(): Observable<any> {
    const form = this.validateForm;
    this.listOfData.forEach(l => {
      this.weekday_schedules.push({
        weekdays: l.weeks,
        number: l.episode
      });
    });
    // const seriesNum = form.get('num').value;
    // if (form.get('start_episode').value > seriesNum || form.get('start_episode').value > form.get('end_episode').value ||
    //   form.get('end_episode').value > seriesNum
    // ) {
    //    this.message.warning(this.translate.instant('global.please-select-correct-range-of-episodes'));
    // } else {
    const data = {
      channel_name: form.value['channel'] || null,
      name: form.value['theatre'] || null,
      air_date: Util.dateToString(form.get('premiereTime').value) || null,
      broadcast_time: Util.dateFullToString(form.get('startBroadcastTime').value).substring(11, 19) || null,
      weekday_schedules: this.weekday_schedules || null,
      // program_id: form.value['series'] || null,
      // broadcast_date: Util.dateToString(form.get('currentBroadcastDate').value) || null,
      // start_episode: form.value['start_episode'] || null,
      // end_episode: form.value['end_episode'] || null,
      // episode: form.value['num'] || null,
    };
    console.log(data);
    return this.service.addTheatre(data);
    // }
  }
}
