import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitFirstReviewComponent } from './submit-first-review.component';

describe('SubmitFirstReviewComponent', () => {
  let component: SubmitFirstReviewComponent;
  let fixture: ComponentFixture<SubmitFirstReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitFirstReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitFirstReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
