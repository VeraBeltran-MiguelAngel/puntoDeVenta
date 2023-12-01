import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeEliminarComponent } from './mensaje-eliminar.component';

describe('MensajeEliminarComponent', () => {
  let component: MensajeEliminarComponent;
  let fixture: ComponentFixture<MensajeEliminarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensajeEliminarComponent]
    });
    fixture = TestBed.createComponent(MensajeEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
