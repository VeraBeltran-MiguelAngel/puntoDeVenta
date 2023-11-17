import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMembresiasPagoEfecComponent } from './lista-membresias-pago-efec.component';

describe('ListaMembresiasPagoEfecComponent', () => {
  let component: ListaMembresiasPagoEfecComponent;
  let fixture: ComponentFixture<ListaMembresiasPagoEfecComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaMembresiasPagoEfecComponent]
    });
    fixture = TestBed.createComponent(ListaMembresiasPagoEfecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
