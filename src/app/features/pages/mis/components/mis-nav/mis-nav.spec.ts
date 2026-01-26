import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisNav } from './mis-nav';

describe('MisNav', () => {
  let component: MisNav;
  let fixture: ComponentFixture<MisNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
