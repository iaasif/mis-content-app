import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForEdit } from './search-for-edit';

describe('SearchForEdit', () => {
  let component: SearchForEdit;
  let fixture: ComponentFixture<SearchForEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchForEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
