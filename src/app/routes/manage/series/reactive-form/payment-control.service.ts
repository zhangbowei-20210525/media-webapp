import { Injectable } from '@angular/core';
import { ReactiveBase } from './reactive-base';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PaymentControlService {

  constructor() { }

  toFormGroup(reactive: ReactiveBase<any>[] ) {
    const group: any = {};

    reactive.forEach(r => {
      // group[r.key] = r.required
      // ? new FormControl(r.value || '', Validators.required)
      // : new FormControl(r.value || '');
      const arr = [];
      if (r.required) {
        arr.push(Validators.required);
      }
      if ((r as any).reg) {
        arr.push(Validators.pattern((r as any).reg));
      }
      group[r.key] = new FormControl(r.value || '', arr);
    });
    return new FormGroup(group);
  }
}
