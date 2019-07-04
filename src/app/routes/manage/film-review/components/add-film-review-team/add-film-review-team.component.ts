import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FilmReviewService } from '../../film-review.service';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-film-review-team',
  templateUrl: './add-film-review-team.component.html',
  styleUrls: ['./add-film-review-team.component.less']
})
export class AddFilmReviewTeamComponent implements OnInit {

  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: FilmReviewService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      teamName: [null, [Validators.required]],
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

  teamName() {
    return  this.validateForm.get('teamName').value;
  }

  submit(): Observable<any> {
    const form = this.validateForm;
        return this.service.addFilmReviewTeam(form.get('teamName').value);
      }
}
