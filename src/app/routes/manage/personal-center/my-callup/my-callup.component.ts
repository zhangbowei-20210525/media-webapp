import { PaginationDto, MessageService } from '@shared';
import { Component, OnInit } from '@angular/core';
import { PersonalCenterService } from '../personal-center.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-my-callup',
  templateUrl: './my-callup.component.html',
  styleUrls: ['./my-callup.component.less']

})
export class MyCallupComponent implements OnInit {


  constructor(


  ) { }

  ngOnInit() {
  }
}

