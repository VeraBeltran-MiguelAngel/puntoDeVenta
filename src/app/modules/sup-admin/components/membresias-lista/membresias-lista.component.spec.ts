import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiasListaComponent } from './membresias-lista.component';

describe('MembresiasListaComponent', () => {
  let component: MembresiasListaComponent;
  let fixture: ComponentFixture<MembresiasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembresiasListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembresiasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
