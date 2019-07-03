import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFilmReviewPeopleComponent } from './delete-film-review-people.component';

describe('DeleteFilmReviewPeopleComponent', () => {
  let component: DeleteFilmReviewPeopleComponent;
  let fixture: ComponentFixture<DeleteFilmReviewPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFilmReviewPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFilmReviewPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
