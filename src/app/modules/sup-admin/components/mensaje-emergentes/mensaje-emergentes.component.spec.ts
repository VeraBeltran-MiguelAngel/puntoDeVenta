import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeEmergentesComponent } from './mensaje-emergentes.component';

describe('MensajeEmergentesComponent', () => {
  let component: MensajeEmergentesComponent;
  let fixture: ComponentFixture<MensajeEmergentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeEmergentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensajeEmergentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
