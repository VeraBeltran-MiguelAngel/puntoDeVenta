import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioEditarComponent } from './horario-editar.component';

describe('HorarioEditarComponent', () => {
  let component: HorarioEditarComponent;
  let fixture: ComponentFixture<HorarioEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioEditarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorarioEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
