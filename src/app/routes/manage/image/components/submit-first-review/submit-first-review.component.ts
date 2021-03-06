import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-submit-first-review',
  templateUrl: './submit-first-review.component.html',
  styleUrls: ['./submit-first-review.component.less']
})
export class SubmitFirstReviewComponent implements OnInit {
  @Input() id: number;
  @Input() intentonName = [];
  @Input() reviewName = [];
  constructor() { }

  ngOnInit() {
    console.log(this.intentonName);
    console.log(this.reviewName);
  }
}
