import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotJobsAndTender } from './mis-login-parts';

describe('HotJobsAndTender', () => {
  let component: HotJobsAndTender;
  let fixture: ComponentFixture<HotJobsAndTender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotJobsAndTender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotJobsAndTender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
