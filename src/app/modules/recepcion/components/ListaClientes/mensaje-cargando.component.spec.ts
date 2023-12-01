import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeListaComponent } from './mensaje-cargando.component';


describe('MensajeListaComponent', () => {
  let component: MensajeListaComponent;
  let fixture: ComponentFixture<MensajeListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensajeListaComponent]
    });
    fixture = TestBed.createComponent(MensajeListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
