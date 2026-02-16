import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearrangeHotJob } from './rearrange-hot-job';

describe('RearrangeHotJob', () => {
  let component: RearrangeHotJob;
  let fixture: ComponentFixture<RearrangeHotJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RearrangeHotJob]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RearrangeHotJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
