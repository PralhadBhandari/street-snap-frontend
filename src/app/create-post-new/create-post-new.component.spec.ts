import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostNewComponent } from './create-post-new.component';

describe('CreatePostNewComponent', () => {
  let component: CreatePostNewComponent;
  let fixture: ComponentFixture<CreatePostNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePostNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePostNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
