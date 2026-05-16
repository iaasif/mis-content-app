import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTender } from './new-tender';

describe('NewTender', () => {
  let component: NewTender;
  let fixture: ComponentFixture<NewTender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
