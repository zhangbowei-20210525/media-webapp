import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilmReviewService } from '../../film-review.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-idea-config',
  templateUrl: './idea-config.component.html',
  styleUrls: ['./idea-config.component.less']
})
export class IdeaConfigComponent implements OnInit {

  @Input() filmReview: any;
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: FilmReviewService,
    // private message: NzMessageService,
    // private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      ideaSelect: [null, [Validators.required]],
    });
    if (this.filmReview.comment_status === true) {
      this.validateForm.get('ideaSelect').setValue('A');
    }
    if (this.filmReview.comment_status === false) {
      this.validateForm.get('ideaSelect').setValue('B');
    }
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
    if (this.validateForm.get('ideaSelect').value === 'A') {
      return this.service.saveIdeaInfo(this.filmReview.id, true);
    }
    if (this.validateForm.get('ideaSelect').value === 'B') {
      return this.service.saveIdeaInfo(this.filmReview.id, false);
    }
  }

}
