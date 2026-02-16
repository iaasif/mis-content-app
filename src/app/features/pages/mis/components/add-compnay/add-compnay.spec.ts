import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompnay } from './add-compnay';

describe('AddCompnay', () => {
  let component: AddCompnay;
  let fixture: ComponentFixture<AddCompnay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCompnay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompnay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
