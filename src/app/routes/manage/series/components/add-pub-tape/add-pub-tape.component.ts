import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-pub-tape',
  templateUrl: './add-pub-tape.component.html',
  styleUrls: ['./add-pub-tape.component.less']
})
export class AddPubTapeComponent implements OnInit {


  @Input() id: number;
  validateForm: FormGroup;
  phone: number;
  companiesName = [];
  isOpen: boolean;

  constructor(
    private fb: FormBuilder,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    // this.seriesService.getCompaniesName()
    this.validateForm = this.fb.group({
      companyName: [null, [Validators.required]],
      phone: [null, [Validators.required]]
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

  formSubmit(): Observable<any> {
    const form = this.validateForm;
    const data = {
      auth_company_id: form.value['companyName'] || null,
    };
    return this.seriesService.addPubTape(this.id, data);
  }

  openChange() {
    console.log(this.isOpen);
  }

  inputChange() {
    if (this.validateForm.value['phone'] === '') {
      this.isOpen = false;
    }
  }

  search() {
    this.phone = this.validateForm.value['phone'];
    this.seriesService.getCompaniesName(this.phone).subscribe(res => {
      this.companiesName = res;
      this.isOpen = true;
    });
  }

}
