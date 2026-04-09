import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisLogin } from './mis-login';

describe('MisLogin', () => {
  let component: MisLogin;
  let fixture: ComponentFixture<MisLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
