import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFilmReviewTeamComponent } from './delete-film-review-team.component';

describe('DeleteFilmReviewTeamComponent', () => {
  let component: DeleteFilmReviewTeamComponent;
  let fixture: ComponentFixture<DeleteFilmReviewTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFilmReviewTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFilmReviewTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
