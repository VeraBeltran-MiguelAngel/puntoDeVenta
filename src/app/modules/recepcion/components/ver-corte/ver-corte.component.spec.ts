import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCorteComponent } from './ver-corte.component';

describe('VerCorteComponent', () => {
  let component: VerCorteComponent;
  let fixture: ComponentFixture<VerCorteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerCorteComponent]
    });
    fixture = TestBed.createComponent(VerCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
