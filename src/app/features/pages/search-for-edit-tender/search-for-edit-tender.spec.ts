import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForEditTender } from './search-for-edit-tender';

describe('SearchForEditTender', () => {
  let component: SearchForEditTender;
  let fixture: ComponentFixture<SearchForEditTender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForEditTender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchForEditTender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
