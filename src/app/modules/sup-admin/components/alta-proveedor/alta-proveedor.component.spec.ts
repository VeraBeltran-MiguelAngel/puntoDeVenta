import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaProveedorComponent } from './alta-proveedor.component';

describe('AltaProveedorComponent', () => {
  let component: AltaProveedorComponent;
  let fixture: ComponentFixture<AltaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaProveedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
