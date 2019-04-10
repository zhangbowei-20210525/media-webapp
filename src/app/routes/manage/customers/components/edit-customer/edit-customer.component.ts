import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomersService } from '../../customers.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.less']
})
export class EditCustomerComponent implements OnInit {

  @Input() id: number;
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CustomersService,
  ) {
    this.validateForm = this.fb.group({
      custom_type: ['0'],
      name: [null, [Validators.required]],
      abbreviation: [null],
      telephone: [null],
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

  ngOnInit() {
    this.service.getCustomerDetailsInfo(this.id).subscribe(res => {
      this.validateForm = this.fb.group({
        custom_type: [res.custom_type + ''],
        name: [res.name, [Validators.required]],
        abbreviation: [res.abbreviation],
        telephone: [res.telephone],
        liaison_name: [res.license_name, [Validators.required]],
        phone: [res.phone, [Validators.required]],
        wx_id: [res.wx_id],
        email: [res.email],
        tag: [res.tag],
        department: [res.department],
        position: [res.position],
        remark: [res.remark],
      });
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
        return this.service.editCustomer(this.id, data as any);
      } else {
        return Observable.create(() => { throw Error('form invalid'); });
      }
  }

}
