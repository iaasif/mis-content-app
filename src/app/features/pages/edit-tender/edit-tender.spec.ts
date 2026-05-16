import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTender } from './edit-tender';

describe('EditTender', () => {
  let component: EditTender;
  let fixture: ComponentFixture<EditTender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
