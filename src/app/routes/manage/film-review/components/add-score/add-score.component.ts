import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilmReviewService } from '../../film-review.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-score',
  templateUrl: './add-score.component.html',
  styleUrls: ['./add-score.component.less']
})
export class AddScoreComponent implements OnInit {

  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: FilmReviewService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      scoreName: [null, [Validators.required]],
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
    console.log(this.validateForm.get('scoreName').value);
    return this.service.saveScoreInfo(this.validateForm.get('scoreName').value);
  }
}
