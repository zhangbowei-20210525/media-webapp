import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { Observable } from 'rxjs';
import { Util } from '@shared';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-series-info',
  templateUrl: './add-series-info.component.html',
  styleUrls: ['./add-series-info.component.less']
})
export class AddSeriesInfoComponent implements OnInit {

  validateForm: FormGroup;
  programTypeOptions: string[];
  filteredProgramTypes: string[];
  programThemeOptions: string[];
  filteredProgramThemes: string[];

  constructor(
    private fb: FormBuilder,
    private service: SeriesService,
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
    this.service.getProgramTypes().subscribe(result => {
      this.filteredProgramTypes = this.programTypeOptions = result.program_type_choices;
      console.log(result);
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
    const data = _.clone(this.validateForm.value);
    if (data.release_date) {
      data.release_date = Util.dateToString(data.release_date, 'yyyy-MM-dd');
    }
    return this.service.addSeriesInfo(data);
  }

}
