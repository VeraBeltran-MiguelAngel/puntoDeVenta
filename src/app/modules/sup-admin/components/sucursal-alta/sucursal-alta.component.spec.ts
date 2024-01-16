import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalAltaComponent } from './sucursal-alta.component';

describe('SucursalAltaComponent', () => {
  let component: SucursalAltaComponent;
  let fixture: ComponentFixture<SucursalAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalAltaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucursalAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
