import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-submit-second-review',
  templateUrl: './submit-second-review.component.html',
  styleUrls: ['./submit-second-review.component.less']
})
export class SubmitSecondReviewComponent implements OnInit {
  @Input() id: number;
  @Input() intentonName = [];
  @Input() reviewName = [];
  constructor() { }

  ngOnInit() {
    console.log(this.intentonName);
    console.log(this.reviewName);
  }

}
