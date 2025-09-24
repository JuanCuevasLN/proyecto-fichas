import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarService } from '../snack-bar.service';
import { MatButtonModule } from '@angular/material/button';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-video-form-control',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: VideoFormControlComponent,
      multi:true
    }
  ],
  templateUrl: './video-form-control.component.html',
  styleUrl: './video-form-control.component.css'
})
export class VideoFormControlComponent {
  @Input() width = '100%';
  @Input() height = '290px';
  @Input({ required: true}) videoSwitch!: boolean;
  
  private readonly _snackBar = inject(SnackBarService);

  //This is the array videos
  public validFiles: File[] = [];
  public arrVideoSrc: string[] = [];

  private onChange: (value: any) => void = () => {};

  private onTouched: Function = () => {};
  protected disabled: boolean | undefined;

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Writes a new value from the form model into the view.
   * In this case, it sets the imgSrc based on the provided value (image filename).
   * Required by the ControlValueAccessor interface.
   */
  writeValue(value: string[]): void {
    if (Array.isArray(value)) {
      this.arrVideoSrc = value.map(filename =>
        `http://localhost:3000/videos/${filename}`
      );
    } else {
      this.arrVideoSrc = [];
    }
  }

  //Event drop and dragover
  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    $event.preventDefault();
    
    if ($event.dataTransfer?.files) {
      const file = $event.dataTransfer;
      this.onVideoSelected(file);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    $event.preventDefault();
  }

  protected onVideoSelected(event: Event | DataTransfer) {
    let fileList: FileList | null = null
    let fileInput: HTMLInputElement | undefined

    if (event instanceof DataTransfer) {
      fileList = event.files
    } else {
      fileInput = event.target as HTMLInputElement
      fileList = fileInput.files
    }

    if (!fileList || fileList.length === 0) return 

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);

      if (file && this.validationImage(file)) {
        const videoSrc = this.generateVideoURL(file);
        this.validFiles.push(file);
        this.arrVideoSrc.push(videoSrc);
      }
    }
    
    if (fileInput) fileInput.value = ''
    this.onChange?.(this.validFiles);
  }

  validationImage(file: File | null): boolean {
    if (!file) return false;

    if (file.type.split('/')[0] !== 'video') {
      this._snackBar.openSnarkBar('Uno de los elementos seleccionado no es un video valido');
      return false;
    }

    return true;
  }

  private generateVideoURL(file: File): string {
    return URL.createObjectURL(file);
  }

  removeVideo(index: number): void {
    this.validFiles.splice(index, 1);
    this.arrVideoSrc.splice(index, 1);
    this.onChange?.(this.validFiles)
  }

}
