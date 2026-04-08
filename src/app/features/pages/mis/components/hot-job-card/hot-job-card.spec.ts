import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotJobCard } from './hot-job-card';

describe('HotJobCard', () => {
  let component: HotJobCard;
  let fixture: ComponentFixture<HotJobCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotJobCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotJobCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
