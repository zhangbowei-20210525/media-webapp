import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRightComponent } from './add-right.component';

describe('AddRightComponent', () => {
  let component: AddRightComponent;
  let fixture: ComponentFixture<AddRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
