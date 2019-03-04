import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { MentionOnSearchTypes } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { NullAstVisitor } from '@angular/compiler';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-tape',
  templateUrl: './add-tape.component.html',
  styleUrls: ['./add-tape.component.less']
})
export class AddTapeComponent implements OnInit {

  @Input() id: number;
  onlineTapeForm: FormGroup;
  entityTapeForm: FormGroup;
  source_type: string;
  listOfOption = [];
  sound_track = [];

  constructor(
    private fb: FormBuilder,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.source_type = 'online';
    this.listOfOption = [
      { key: '1000', value: 1000 },
      { key: '2000', value: 2000 },
      { key: '3000', value: 3000 },
      { key: '4000', value: 4000 },
      { key: '5000', value: 5000 },
      { key: '6000', value: 6000 },
      { key: '7000', value: 7000 },
      { key: '8000', value: 8000 },
      { key: '9000', value: 9000 },
      { key: '10000', value: 10000 },
    ];

    this.onlineTapeForm = this.fb.group({
      name: [null, [Validators.required]],
      language: [null],
      subtitle: [null],
      format: [null],
      bit_rate: [null],
    });

    this.entityTapeForm = this.fb.group({
      name: [null, [Validators.required]],
      episode: [null],
      language: [null],
      subtitle: [null],
      ch1: [null],
      ch2: [null],
      ch3: [null],
      ch4: [null],
      ch5: [null],
      ch6: [null],
      sharpness: [null],
      carrier: [null],
      brand: [null],
      model: [null],
      storage_date: [null],
      storage_location: [null],
      detail_location: [null],
    });
  }

  formSubmit(): Observable<any> {
    if (this.source_type === 'online') {
      const otForm = this.onlineTapeForm;
      for (const i in otForm.controls) {
        if (otForm.controls.hasOwnProperty(i)) {
          const control = otForm.controls[i];
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      }
      const data = {
        program_id: this.id,
        name: otForm.value['name'] || null,
        language: otForm.value['language'] || null,
        subtitle: otForm.value['subtitle'] || null,
        format: otForm.value['format'] || null,
        bit_rate: otForm.value['bit_rate'] || null,
        source_type: 'online',
      };
      if (otForm.valid === true) {
        return this.seriesService.addTape(data);
      } else {
        return Observable.create(() => { throw Error('otForm invalid'); });
      }
    }
    if (this.source_type === 'entity') {
      const etForm = this.entityTapeForm;
      for (const i in etForm.controls) {
        if (etForm.controls.hasOwnProperty(i)) {
          const control = etForm.controls[i];
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      }
      const ch1 = etForm.value['ch1'] || null;
      const ch2 = etForm.value['ch2'] || null;
      const ch3 = etForm.value['ch3'] || null;
      const ch4 = etForm.value['ch4'] || null;
      const ch5 = etForm.value['ch5'] || null;
      const ch6 = etForm.value['ch6'] || null;
      const storage_date = new DatePipe('zh-CN').transform(etForm.value['storage_date'], 'yyyy-MM-dd');
      this.sound_track = [ch1, ch2, ch3, ch4, ch5, ch6];
      const data = {
        program_id: this.id,
        name: etForm.value['name'] || null,
        language: etForm.value['language'] || null,
        subtitle: etForm.value['subtitle'] || null,
        source_type: 'entity',
        episode: etForm.value['episode'] || null,
        sharpness: etForm.value['sharpness'] || null,
        carrier: etForm.value['carrier'] || null,
        brand: etForm.value['brand'] || null,
        model: etForm.value['model'] || null,
        storage_date: storage_date || null,
        storage_location: etForm.value['storage_location'] || null,
        detail_location: etForm.value['detail_location'] || null,
        sound_track: this.sound_track
      };
      if (etForm.valid === true) {
        return this.seriesService.addEntityTape(data);
      } else {
        return Observable.create(() => { throw Error('etForm invalid'); });
      }
    }
  }
}
