import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChoreographyComponent } from '../../choreography.component';
import { ChoreographyService } from '../../choreography.service';

@Component({
  selector: 'app-add-theatre',
  templateUrl: './add-theatre.component.html',
  styleUrls: ['./add-theatre.component.less']
})
export class AddTheatreComponent implements OnInit {

  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ChoreographyService
  ) { }

  marks: any = {
    0: '星期一',
    16: '星期二',
    32: '星期三',
    48: '星期四',
    64: '星期五',
    80: '星期六',
    100: '星期日'
  };

  ngOnInit() {
    this.validateForm = this.fb.group({
      channel: [null, [Validators.required]],
      theatre: [null, [Validators.required]],
      broadcastDate: [[1, 2, 3, 4, 5, 6, 7], [Validators.required]],
      // ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    });
  }

}
