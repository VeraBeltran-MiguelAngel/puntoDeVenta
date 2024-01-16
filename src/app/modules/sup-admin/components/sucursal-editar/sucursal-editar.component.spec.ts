import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalEditarComponent } from './sucursal-editar.component';

describe('SucursalEditarComponent', () => {
  let component: SucursalEditarComponent;
  let fixture: ComponentFixture<SucursalEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucursalEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
