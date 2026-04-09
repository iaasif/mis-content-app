import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCompany } from './delete-company';

describe('DeleteCompany', () => {
  let component: DeleteCompany;
  let fixture: ComponentFixture<DeleteCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCompany);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
