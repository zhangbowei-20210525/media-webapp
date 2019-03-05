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

  constructor(
    private fb: FormBuilder,
    private service: SeriesService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
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
    return this.validateForm.value['type'] || null;
  }

}
