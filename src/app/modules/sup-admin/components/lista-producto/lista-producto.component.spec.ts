import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProductoComponent } from './lista-producto.component';

describe('ListaProductoComponent', () => {
  let component: ListaProductoComponent;
  let fixture: ComponentFixture<ListaProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
