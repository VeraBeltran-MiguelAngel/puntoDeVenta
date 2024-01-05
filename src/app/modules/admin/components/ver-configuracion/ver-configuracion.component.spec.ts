import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerConfiguracionComponent } from './ver-configuracion.component';

describe('VerConfiguracionComponent', () => {
  let component: VerConfiguracionComponent;
  let fixture: ComponentFixture<VerConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerConfiguracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
