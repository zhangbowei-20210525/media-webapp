import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { Observable } from 'rxjs';
import { dtoMap, dtoCatchError } from 'src/app/core/rxjs-pipe-handles';

@Component({
  selector: 'app-add-series-info',
  templateUrl: './add-series-info.component.html',
  styleUrls: ['./add-series-info.component.less']
})
export class AddSeriesInfoComponent implements OnInit {

  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      nickname: [null],
      program_type: [null, [Validators.required]],
      theme: [null],
      episode: [null],
      introduction: [null],
      director: [null],
      screen_writer: [null],
      protagonist: [null],
      product_company: [null],
      supervisor: [null],
      general_producer: [null],
      producer: [null],
      release_date: [null],
      language: [null],
    });
  }

  formSubmit(): Observable<any> {
    const form = this.validateForm;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
      const data = {
        name: form.value['name'] || null,
        nickname: form.value['nickname'] || null,
        program_type: form.value['program_type'] || null,
        theme: form.value['theme'] || null,
        episode: form.value['episode'] || null,
        introduction: form.value['introduction'] || null,
        director: form.value['director'] || null,
        screen_writer: form.value['screen_writer'] || null,
        protagonist: form.value['protagonist'] || null,
        product_company: form.value['product_company'] || null,
        supervisor: form.value['supervisor'] || null,
        general_producer: form.value['general_producer'] || null,
        producer: form.value['producer'] || null,
        release_date: form.value['release_date'] || null,
        language: form.value['language'] || null,
      };
      if (form.valid === true) {
        return this.seriesService.addSeriesInfo(data).pipe(dtoMap(e => e.data), dtoCatchError());
      } else {
        return Observable.create(() => { throw Error('form invalid'); });
      }
  }

}
