import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProveedorComponent } from './lista-proveedor.component';

describe('ListaProveedorComponent', () => {
  let component: ListaProveedorComponent;
  let fixture: ComponentFixture<ListaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProveedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
