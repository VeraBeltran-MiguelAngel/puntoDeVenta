import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiasEditarComponent } from './membresias-editar.component';

describe('MembresiasEditarComponent', () => {
  let component: MembresiasEditarComponent;
  let fixture: ComponentFixture<MembresiasEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembresiasEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembresiasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
