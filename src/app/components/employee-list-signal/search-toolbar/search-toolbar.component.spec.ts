import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchToolbar } from './search-toolbar.component';

describe('SearchToolbar', () => {
  let component: SearchToolbar;
  let fixture: ComponentFixture<SearchToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
