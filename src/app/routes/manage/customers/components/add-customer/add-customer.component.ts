import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from '../../customers.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.less']
})
export class AddCustomerComponent implements OnInit {

  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CustomersService,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      custom_type: ['0'],
      name: [null, [Validators.required]],
      abbreviation: [null],
      telephone: [null, [Validators.required]],
      liaison_name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      wx_id: [null],
      email: [null],
      tag: [null],
      department: [null],
      position: [null],
      remark: [null],
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
        custom_type: form.value['custom_type'] || null,
        name: form.value['name'] || null,
        abbreviation: form.value['abbreviation'] || null,
        telephone: form.value['telephone'] || null,
        liaison_name: form.value['liaison_name'] || null,
        phone: form.value['phone'] || null,
        wx_id: form.value['wx_id'] || null,
        email: form.value['email'] || null,
        department: form.value['department'] || null,
        position: form.value['position'] || null,
        remark: form.value['remark'] || null,
        tag: form.value['tag'] || null,
        liaison_remark: null
      };
      if (form.valid === true) {
        return this.service.addCustomer(data);
      } else {
        return Observable.create(() => { throw Error('form invalid'); });
      }
  }

}
