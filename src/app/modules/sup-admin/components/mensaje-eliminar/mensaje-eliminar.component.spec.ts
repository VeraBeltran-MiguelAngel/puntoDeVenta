import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeEliminarComponent } from './mensaje-eliminar.component';

describe('MensajeEliminarComponent', () => {
  let component: MensajeEliminarComponent;
  let fixture: ComponentFixture<MensajeEliminarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeEliminarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensajeEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
