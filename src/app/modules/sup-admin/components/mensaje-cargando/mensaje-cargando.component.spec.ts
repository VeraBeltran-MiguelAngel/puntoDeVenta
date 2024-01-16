import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeCargandoComponent } from './mensaje-cargando.component';

describe('MensajeCargandoComponent', () => {
  let component: MensajeCargandoComponent;
  let fixture: ComponentFixture<MensajeCargandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeCargandoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensajeCargandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
