import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirImagenesComponent } from './subirImagenes.component';

describe('SubirImagenesComponent', () => {
  let component: SubirImagenesComponent;
  let fixture: ComponentFixture<SubirImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirImagenesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubirImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
