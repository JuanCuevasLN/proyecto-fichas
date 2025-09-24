import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, HostListener, inject, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../snack-bar.service';

@Component({
  selector: 'app-image-form-control',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  // Register this component as a ControlValueAccessor
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImageFormControlComponent,
      multi: true
    },
    SnackBarService
  ],
  templateUrl: './image-form-control.component.html',
  styleUrl: './image-form-control.component.scss'
})
export class ImageFormControlComponent {
  @Input() width = '100%';
  @Input() height = '290px';
  @Input({ required: true }) imageSwitch!: boolean;
  private readonly _snackBar = inject(SnackBarService);

  // The source URL for the displayed image
  public arrImagenSrc: string[] = []
  public validFiles: File[] = []

  // A function to notify the form of value changes (set by Angular)
  private onChange: (value: any) => void = () => {};

  private onTouched: Function = () => {};
  protected disabled: boolean | undefined

  /**
  * Registers a callback function (fn) that should be called when the control's value changes in the UI.
  * This function is provided by Angular forms API and is essential for two-way binding.
  */
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
      this.arrImagenSrc = value.map(filename =>
        `http://localhost:3000/imagenes/${filename}`
      );
    } else {
      this.arrImagenSrc = [];
    }
  }

  //Event drop and dragover
  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    $event.preventDefault();

    if ($event.dataTransfer?.files) {
      let file = $event.dataTransfer
      this.onImageSelected(file);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    $event.preventDefault();
  }

  protected onImageSelected(event: Event | DataTransfer) {
    let fileList: FileList | null = null;
    let fileInput: HTMLInputElement | undefined;

    if (event instanceof DataTransfer) {
      fileList = event.files;
    } else {
      fileInput =  event.target as HTMLInputElement;
      fileList = fileInput.files;
    }
    
    if (!fileList || fileList.length === 0) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      
      if (file && this.validationImage(file)) {
        const imgSrc = this.generateImageURL(file)
        this.validFiles.push(file)
        this.arrImagenSrc.push(imgSrc)
      }
    }
    
    if (fileInput) fileInput.value = '';
    this.onChange?.(this.validFiles)
  }

  validationImage(file: File | null): boolean{
    if(!file) return false

    if (file.type.split('/')[0] !== 'image'){
      this._snackBar.openSnarkBar("Uno de los elemntos seleccioandos no es una imagen")
      return  false
    }

    if (file.size > 2 * 1024 * 1024) {
      this._snackBar.openSnarkBar("Una de las imagenes seleccionadas eccedes el tamaño", )
      return false      
    }
    
    return true
  }

  removeImage(index: number): void {
    this.validFiles.splice(index, 1);
    this.arrImagenSrc.splice(index, 1);

    console.log("esto es lo estoy actualizando",this.validFiles)
    this.onChange?.(this.validFiles);
  }

  // removeAndUpdate(file: File){
  //   // Clean up previous blob URL if it exists.
  //   this.revokeImageURL();
  //   // Generate a temporary URL for the selected image and update the image source.
  //   this.imgSrc = this.generateImageURL(file);
  //   this.onChange?.(file);
  // }

  // ngOnDestroy() {
  //   // Ensures any existing blob URLs are revoked to prevent memory leaks.
  //   this.revokeImageURL()
  // }

  // /**
  //  * Revokes the object URL associated with the image source if it's a blob URL.
  //  */
  // private revokeImageURL() {
  //   if (this.imgSrc && this.imgSrc.startsWith('blob:')) {
  //     URL.revokeObjectURL(this.imgSrc);
  //     // Reset the imgSrc because it points to an invalid URL
  //     this.imgSrc = undefined;
  //   }
  // }

  /**
   * Generates a temporary blob URL for the given file.
   * @param file - The File object to generate a URL for.
   * @returns A blob URL string that can be used to display the file in the browser.
   */
  private generateImageURL(file: File): string {
    return URL.createObjectURL(file)
  }
}