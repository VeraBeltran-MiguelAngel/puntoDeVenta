import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiasAgregarComponent } from './membresias-agregar.component';

describe('MembresiasAgregarComponent', () => {
  let component: MembresiasAgregarComponent;
  let fixture: ComponentFixture<MembresiasAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembresiasAgregarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembresiasAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
