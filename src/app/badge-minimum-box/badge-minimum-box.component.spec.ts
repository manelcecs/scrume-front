import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeMinimumBoxComponent } from './badge-minimum-box.component';

describe('BadgeMinimumBoxComponent', () => {
  let component: BadgeMinimumBoxComponent;
  let fixture: ComponentFixture<BadgeMinimumBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeMinimumBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeMinimumBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
