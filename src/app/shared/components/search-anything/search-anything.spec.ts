import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAnything } from './search-anything';

describe('SearchAnything', () => {
  let component: SearchAnything;
  let fixture: ComponentFixture<SearchAnything>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAnything]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAnything);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
