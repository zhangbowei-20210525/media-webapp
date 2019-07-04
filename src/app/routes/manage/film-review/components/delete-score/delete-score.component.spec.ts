import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteScoreComponent } from './delete-score.component';

describe('DeleteScoreComponent', () => {
  let component: DeleteScoreComponent;
  let fixture: ComponentFixture<DeleteScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
