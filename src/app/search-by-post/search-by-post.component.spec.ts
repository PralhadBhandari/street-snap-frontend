import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByPostComponent } from './search-by-post.component';

describe('SearchByPostComponent', () => {
  let component: SearchByPostComponent;
  let fixture: ComponentFixture<SearchByPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchByPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchByPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
