import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepDashboardComponent } from './recep-dashboard.component';

describe('RecepDashboardComponent', () => {
  let component: RecepDashboardComponent;
  let fixture: ComponentFixture<RecepDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecepDashboardComponent]
    });
    fixture = TestBed.createComponent(RecepDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
