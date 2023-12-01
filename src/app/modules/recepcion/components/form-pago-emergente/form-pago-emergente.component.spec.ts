import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPagoEmergenteComponent } from './form-pago-emergente.component';

describe('FormPagoEmergenteComponent', () => {
  let component: FormPagoEmergenteComponent;
  let fixture: ComponentFixture<FormPagoEmergenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormPagoEmergenteComponent]
    });
    fixture = TestBed.createComponent(FormPagoEmergenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
