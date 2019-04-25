import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Util } from '@shared';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-add-liaisons',
  templateUrl: './add-liaisons.component.html'
})
export class AddLiaisonsComponent implements OnInit {

  @Input() id: number;
  liaisonForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CustomersService
  ) { }

  ngOnInit() {
    this.liaisonForm = this.fb.group({
      name: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$/)]],
      wx_id: [null],
      email: [null, [Validators.email]],
      department: [null],
      position: [null],
      remark: [null]
    });
  }

  validation() {
    return Util.validationForm(this.liaisonForm);
  }

  submit() {
    return this.service.addLiaison(this.id, this.liaisonForm.value);
  }

}
