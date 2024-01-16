import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCategoriaComponent } from './lista-categoria.component';

describe('ListaCategoriaComponent', () => {
  let component: ListaCategoriaComponent;
  let fixture: ComponentFixture<ListaCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
