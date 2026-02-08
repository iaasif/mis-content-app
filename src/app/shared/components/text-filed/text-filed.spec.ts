import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFiled } from './text-filed';

describe('TextFiled', () => {
  let component: TextFiled;
  let fixture: ComponentFixture<TextFiled>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFiled]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextFiled);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
