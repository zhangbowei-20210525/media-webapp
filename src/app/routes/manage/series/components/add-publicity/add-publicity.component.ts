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
  programList = [];
  programNames = [];
  companies = [];
  programTypeOptions: string[];
  filteredProgramTypes: string[];


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

    this.service.getProgramTypes().subscribe(result => {
      this.filteredProgramTypes = this.programTypeOptions = result.program_type_choices;
    });

    this.fetchFuzzyOptions('');
  }

  fetchFuzzyOptions(value: string) {
    this.service.fuzzySearch(value).subscribe(result => {
      this.programList = result.list;
    });
  }

  onProgramTypeInput(value: string) {
    this.filteredProgramTypes = this.programTypeOptions.filter(item => item.indexOf(value) >= 0);
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
    const value = this.validateForm.value['program_name'];
    const programType = this.validateForm.get('program_type');
    const find = this.programList.find(item => item.name === value);
    if (find) {
      programType.setValue(find.program_type);
      programType.disable();
    } else {
      this.validateForm.get('program_type').reset();
      programType.enable();
    }
    this.fetchFuzzyOptions(value);
  }

}
