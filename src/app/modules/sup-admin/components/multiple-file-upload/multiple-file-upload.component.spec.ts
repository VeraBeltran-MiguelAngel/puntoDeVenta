import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleFileUploadComponent } from './multiple-file-upload.component';

describe('MultipleFileUploadComponent', () => {
  let component: MultipleFileUploadComponent;
  let fixture: ComponentFixture<MultipleFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleFileUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultipleFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
