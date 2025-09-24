import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationAndUpdateFichasComponent } from './creation-and-update-fichas.component';

describe('CreationAndUpdateFichasComponent', () => {
  let component: CreationAndUpdateFichasComponent;
  let fixture: ComponentFixture<CreationAndUpdateFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationAndUpdateFichasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreationAndUpdateFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
