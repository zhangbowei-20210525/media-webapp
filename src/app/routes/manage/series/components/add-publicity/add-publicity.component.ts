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
    public settings: SettingsService,
  ) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      program_name: [null, [Validators.required]],
      program_type: [null, [Validators.required]],
      type: [null, [Validators.required]],
      checkCompanies: [null],
      currentCompany: [true]
    });
    this.service.getCompanies().pipe(map(item => {
      item.forEach(c => {
        this.companies.push({
          label: c.company_name,
          value: c.company_id,
          checked: false
        });
      });
      return this.companies;
    })).subscribe(res => {
      const companyNames = res.filter(x => {
        return this.settings.user.company_id !== x.value;
      });
      this.validateForm.get('checkCompanies').setValue(companyNames);
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

  checkChange() {
    if (this.validateForm.value['checkCompanies']) {
      const checkedCom = this.validateForm.value['checkCompanies'].filter(x => {
        return x.checked === true;
      });
      return checkedCom;
    }
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
