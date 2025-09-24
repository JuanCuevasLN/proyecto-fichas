import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsFormControlComponent } from './documents-form-control.component';

describe('DocumentsFormControlComponent', () => {
  let component: DocumentsFormControlComponent;
  let fixture: ComponentFixture<DocumentsFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsFormControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentsFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
