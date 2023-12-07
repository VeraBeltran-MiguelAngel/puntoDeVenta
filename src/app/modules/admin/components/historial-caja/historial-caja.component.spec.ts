import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCajaComponent } from './historial-caja.component';

describe('HistorialCajaComponent', () => {
  let component: HistorialCajaComponent;
  let fixture: ComponentFixture<HistorialCajaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialCajaComponent]
    });
    fixture = TestBed.createComponent(HistorialCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
