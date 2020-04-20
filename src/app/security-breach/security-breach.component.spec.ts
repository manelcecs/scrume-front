import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityBreachComponent } from './security-breach.component';

describe('SecurityBreachComponent', () => {
  let component: SecurityBreachComponent;
  let fixture: ComponentFixture<SecurityBreachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityBreachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityBreachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
