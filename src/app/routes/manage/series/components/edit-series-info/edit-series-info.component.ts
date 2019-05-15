import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-series-info',
  templateUrl: './edit-series-info.component.html',
  styleUrls: ['./edit-series-info.component.less']
})
export class EditSeriesInfoComponent implements OnInit {

  @Input() id: number;

  validateForm: FormGroup;
  programTypeOptions: string[];
  filteredProgramTypes: string[];
  programThemeOptions: string[];
  filteredProgramThemes: string[];

  constructor(
    private fb: FormBuilder,
    private service: SeriesService,
  ) {
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

  ngOnInit() {
    this.service.getSeriesDetailsInfo(this.id).subscribe(result => {
      this.validateForm = this.fb.group({
        name: [result.name, [Validators.required]],
        nickname: [result.nickname],
        program_type: [result.program_type, [Validators.required]],
        theme: [result.theme],
        episode: [result.episode],
        introduction: [result.introduction],
        director: [result.director],
        screen_writer: [result.screen_writer],
        protagonist: [result.protagonist],
        product_company: [result.product_company],
        supervisor: [result.supervisor],
        general_producer: [result.general_producer],
        producer: [result.producer],
        release_date: [result.release_date],
        language: [result.language],
      });
    });

    this.service.getProgramTypes().subscribe(result => {
      this.filteredProgramTypes = this.programTypeOptions = result.program_type_choices;
      this.filteredProgramThemes = this.programThemeOptions = result.theme_choices;
    });
  }

  onProgramTypeInput(value: string) {
    this.filteredProgramTypes = this.programTypeOptions.filter(item => item.indexOf(value) >= 0);
  }

  onProgramThemeInput(value: string) {
    this.filteredProgramThemes = this.programThemeOptions.filter(item => item.indexOf(value) >= 0);
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
    if (data.release_date) {
      data.release_date = new DatePipe('zh-CN').transform(data.release_date, 'yyyy-MM-dd');
    }
    return this.service.editSeriesInfo(this.id, data);
  }

}
