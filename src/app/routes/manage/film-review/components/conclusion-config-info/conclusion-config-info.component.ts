import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilmReviewService } from '../../film-review.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conclusion-config-info',
  templateUrl: './conclusion-config-info.component.html',
  styleUrls: ['./conclusion-config-info.component.less']
})
export class ConclusionConfigInfoComponent implements OnInit {

  @Input() filmReview: any;
  validateForm: FormGroup;
  info = [];
  constructor(
    private fb: FormBuilder,
    private service: FilmReviewService,
    // private message: NzMessageService,
    // private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      conclusionSelect: [null, [Validators.required]],
    });
    this.service.getConclusionConfigInfo().subscribe(res => {
      this.info = res;
    });
    this.validateForm.get('conclusionSelect').setValue(this.filmReview.conclusion_item.id);
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
    console.log(this.validateForm.get('conclusionSelect').value);
    return this.service.saveConclusionConfigInfo(this.filmReview.id, this.validateForm.get('conclusionSelect').value);
  }
}
