import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { map } from 'rxjs/operators';
import { Settings } from 'http2';
import { SettingsService, I18nService } from '@core';

@Component({
  selector: 'app-add-publicity',
  templateUrl: './add-publicity.component.html',
  styleUrls: ['./add-publicity.component.less']
})
export class AddPublicityComponent implements OnInit {
  validateForm: FormGroup;
  data: any;
  programList = [];

  disabled: boolean;
  programNames = [];
  companies = [];


  constructor(
    private fb: FormBuilder,
    private service: SeriesService,
    private setService: SettingsService,
  ) {
    this.validateForm = this.fb.group({
      program_name: [null, [Validators.required]],
      program_type: [null, [Validators.required]],
      type: [null, [Validators.required]],
      checkCompanies: [null],
      currentCompany: [true]
    });
  }

  ngOnInit() {
    this.service.getCompanies().pipe(map(item => {
      item.forEach(c => {
        this.companies.push({
        label: c.company_name,
        value: c.id,
        company_full_name: c.company_full_name,
        department: c.department,
        name: c.name,
        phone: c.phone,
      });
      });
      return this.companies;
    })).subscribe(res => {
      this.validateForm = this.fb.group({
        program_name: [null, [Validators.required]],
        program_type: [null, [Validators.required]],
        type: [null, [Validators.required]],
        checkCompanies: [res],
        currentCompany: [true]
      });
    });
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

  getValue() {
    const data = Object.assign(this.validateForm.value);
    const selected = this.programList.find(item => item.name === data.program_name);
    if (selected) {
      data.id = selected.id;
    }
    return data;
  }

  onInput() {
    this.service.fuzzySearch(this.validateForm.value['program_name']).subscribe(s => {
      this.programList = s.list;
      if (this.disabled === true) {
        this.disabled = false;
          this.validateForm = this.fb.group({
          program_name: [this.validateForm.value['program_name'], [Validators.required]],
          program_type: [null, [Validators.required]],
          type: [null, [Validators.required]],
        });
      }
      this.programList.forEach(pf => {
        if (this.validateForm.value['program_name'] === pf.name) {
          this.validateForm = this.fb.group({
            program_name: [this.validateForm.value['program_name'], [Validators.required]],
            program_type: [pf.program_type, [Validators.required]],
            type: [null, [Validators.required]],
          });
          this.disabled = true;
        }
        // if (this.validateForm.value['program_name'] !== pf.name) {
        //   console.log('2');
        //   console.log(this.validateForm.value['program_name']);
        //   this.validateForm = this.fb.group({
        //     program_name: [this.validateForm.value['program_name'], [Validators.required]],
        //     program_type: [null, [Validators.required]],
        //     type: [null, [Validators.required]],
        //   });
        // }
      });
    });
  }

}
