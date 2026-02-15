import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxNew } from './checkbox-new';

describe('CheckboxNew', () => {
  let component: CheckboxNew;
  let fixture: ComponentFixture<CheckboxNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
