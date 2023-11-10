import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradasComponent } from './entradas.component';

describe('EntradasComponent', () => {
  let component: EntradasComponent;
  let fixture: ComponentFixture<EntradasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntradasComponent]
    });
    fixture = TestBed.createComponent(EntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
