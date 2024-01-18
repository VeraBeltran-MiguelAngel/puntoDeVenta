import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergenteInfoClienteComponent } from './emergente-info-cliente.component';

describe('EmergenteInfoClienteComponent', () => {
  let component: EmergenteInfoClienteComponent;
  let fixture: ComponentFixture<EmergenteInfoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergenteInfoClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmergenteInfoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
