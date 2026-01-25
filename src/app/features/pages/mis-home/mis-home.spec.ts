import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisHome } from './mis-home';

describe('MisHome', () => {
  let component: MisHome;
  let fixture: ComponentFixture<MisHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
