import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChoreographyComponent } from '../../choreography.component';

@Component({
  selector: 'app-add-theatre',
  templateUrl: './add-theatre.component.html',
  styleUrls: ['./add-theatre.component.less']
})
export class AddTheatreComponent implements OnInit {

  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ChoreographyComponent
  ) { }

  ngOnInit() {
    // this.validateForm = this.fb.group({
    //   channel: [null, [Validators.required]],
    //   theatre: [null, [Validators.required]],
    //   broadcastDate: [null, [Validators.required]],
    // });
  }

}
