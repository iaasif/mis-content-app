import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotJobPreview } from './hot-job-preview';

describe('HotJobPreview', () => {
  let component: HotJobPreview;
  let fixture: ComponentFixture<HotJobPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotJobPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotJobPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
