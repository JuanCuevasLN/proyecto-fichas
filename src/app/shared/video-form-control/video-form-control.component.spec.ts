import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoFormControlComponent } from './video-form-control.component';

describe('VideoFormControlComponent', () => {
  let component: VideoFormControlComponent;
  let fixture: ComponentFixture<VideoFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoFormControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
