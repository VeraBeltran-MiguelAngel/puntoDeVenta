import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeEmergenteComponent } from './mensaje-emergente.component';

describe('MensajeEmergenteComponent', () => {
  let component: MensajeEmergenteComponent;
  let fixture: ComponentFixture<MensajeEmergenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensajeEmergenteComponent]
    });
    fixture = TestBed.createComponent(MensajeEmergenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
