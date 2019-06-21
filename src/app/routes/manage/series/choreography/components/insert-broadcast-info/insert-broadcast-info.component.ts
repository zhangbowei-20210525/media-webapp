import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChoreographyService } from '../../choreography.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Util } from '@shared';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-insert-broadcast-info',
  templateUrl: './insert-broadcast-info.component.html',
  styleUrls: ['./insert-broadcast-info.component.less']
})
export class InsertBroadcastInfoComponent implements OnInit {

  @Input() data: any;
  @Input() tid: number;
  @Input() sid: number;

  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ChoreographyService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      series: [{ value: null, disabled: true }, [Validators.required]],
      currentBroadcastDate: [null, [Validators.required]],
      start_episode: [null, [Validators.required]],
      end_episode: [null, [Validators.required]],
      num: [null, [Validators.required]],
    });
    this.validateForm.get('series').setValue(this.data.name);
    this.validateForm.get('num').setValue(this.data.episode);
    this.validateForm.get('currentBroadcastDate').setValue(new Date());
  }

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

  submit(): Observable<any> {
    const form = this.validateForm;
    const data = {
      // program_id: this.data.id,
      broadcast_date: Util.dateToString(form.get('currentBroadcastDate').value) || null,
      start_episode: form.value['start_episode'] || null,
      end_episode: form.value['end_episode'] || null,
      episode: form.value['num'] || null,
    };
    console.log(data);
    return this.service.addInsertBroadcastInfo(this.tid, this.data.id, this.sid, data).pipe(tap(x => {
      x.broadcast_start_date = x.broadcast_start_date.substring(5, 10);
      x.broadcast_end_date = x.broadcast_end_date.substring(5, 10);
    }));
  }

}
