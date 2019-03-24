import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from '../../customers.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-log',
  templateUrl: './add-log.component.html',
  styleUrls: ['./add-log.component.less']
})
export class AddLogComponent implements OnInit {

  @Input() id: number;
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CustomersService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      content: [null, [Validators.required]],
      title: [null, [Validators.maxLength(6)]],
    });
  }

  formSubmit(): Observable<any> {
    const form = this.validateForm;
    for (const i in form.controls) {
      if (form.controls.hasOwnProperty(i)) {
        const control = form.controls[i];
        control.markAsDirty();
        control.updateValueAndValidity();
      }
    }
      const data = {
        content: form.value['content'] || null,
        title: form.value['title'] || null,
      };
      if (form.valid === true) {
        return this.service.addLog(this.id, data);
      } else {
        return Observable.create(() => { throw Error('form invalid'); });
      }
  }

}
