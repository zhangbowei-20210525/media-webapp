import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChoreographyService } from '../../choreography.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Util } from '@shared';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-broadcasting-info',
  templateUrl: './add-broadcasting-info.component.html',
  styleUrls: ['./add-broadcasting-info.component.less']
})
export class AddBroadcastingInfoComponent implements OnInit {

  @Input() data: any;
  @Input() tid: number;
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
      return this.service.addBroadcastingInfo('Insert', this.tid, this.data.id,
      Util.dateToString(form.get('currentBroadcastDate').value),
      form.value['start_episode'],
      form.value['end_episode']);
    }


}
