import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';

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

  constructor(
    private fb: FormBuilder,
    private service: SeriesService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      program_name: [null, [Validators.required]],
      program_type: [null, [Validators.required]],
      type: [null, [Validators.required]],
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

  submit(): Observable<any> {
    this.data = {
      program_name: this.validateForm.value['program_name'] || null,
      program_type: this.validateForm.value['program_type'] || null,
      type: this.validateForm.value['type'] || null,
    };
    return this.data;
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
