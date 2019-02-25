import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SeriesService } from '../../series.service';

@Component({
  selector: 'app-add-pub-tape',
  templateUrl: './add-pub-tape.component.html',
  styleUrls: ['./add-pub-tape.component.less']
})
export class AddPubTapeComponent implements OnInit {


  @Input() id: number;
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private seriesService: SeriesService,
  ) { }

  ngOnInit() {
    this.seriesService.getCompaniesName()
    this.validateForm = this.fb.group({
      folderName : [null, [Validators.required]]
    });
  }

}
