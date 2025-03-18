import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMapComponent } from './generate-map.component';

describe('GenerateMapComponent', () => {
  let component: GenerateMapComponent;
  let fixture: ComponentFixture<GenerateMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
