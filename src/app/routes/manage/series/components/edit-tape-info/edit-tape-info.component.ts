import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';

@Component({
  selector: 'app-edit-tape-info',
  templateUrl: './edit-tape-info.component.html',
  styleUrls: ['./edit-tape-info.component.less']
})
export class EditTapeInfoComponent implements OnInit {

  @Input() id: number;
  @Input() source_type: string;
  options = [];
  onlineTapeForm: FormGroup;
  entityTapeForm: FormGroup;
  listOfOption = [];
  sound_track = [];
  constructor(
    private fb: FormBuilder,
    private service: SeriesService,
  ) {
    this.onlineTapeForm = this.fb.group({
      program_name: [  null, [Validators.required]],
      program_type: [null, [Validators.required]],
      name: [null, [Validators.required]],
      language: [null],
      subtitle: [null],
      format: [null],
      bit_rate: [null],
    });
    this.entityTapeForm = this.fb.group({
      program_name: [  null, [Validators.required]],
      program_type: [ null, [Validators.required]],
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

  ngOnInit() {
      this.service.getOnlineInfo(this.id).subscribe(result => {
        this.onlineTapeForm = this.fb.group({
          name: [result.name, [Validators.required]],
          language: [result.language],
          subtitle: [result.subtitle],
          format: [result.format],
          bit_rate: [result.bit_rate],
        });
        this.entityTapeForm = this.fb.group({
          name: [result.name, [Validators.required]],
          episode: [result.episode],
          language: [result.language],
          subtitle: [result.subtitle],
          ch1: [result.sound_track[0]],
          ch2: [result.sound_track[1]],
          ch3: [result.sound_track[2]],
          ch4: [result.sound_track[3]],
          ch5: [result.sound_track[4]],
          ch6: [result.sound_track[5]],
          sharpness: [result.sharpness],
          carrier: [result.carrier],
          brand: [result.brand],
          model: [result.model],
          storage_date: [result.storage_date],
          storage_location: [result.storage_location],
          detail_location: [result.detail_location],
        });
  });

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
          name: this.onlineTapeForm.value['name'] || null,
          language: this.onlineTapeForm.value['language'] || null,
          subtitle: this.onlineTapeForm.value['subtitle'] || null,
          format: this.onlineTapeForm.value['format'] || null,
          bit_rate: this.onlineTapeForm.value['bit_rate'] || null,
          source_type: 'online',
        };
        if (this.onlineTapeForm.valid === true) {
          return this.service.editTape(this.id, data);
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
          return this.service.editEntityTape(this.id, data);
        } else {
          return Observable.create(() => { throw Error('etForm invalid'); });
        }
    }
  }

}
