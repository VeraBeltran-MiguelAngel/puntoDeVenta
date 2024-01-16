import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosVistaComponent } from './horarios-vista.component';

describe('HorariosVistaComponent', () => {
  let component: HorariosVistaComponent;
  let fixture: ComponentFixture<HorariosVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosVistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorariosVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
