import { MatIconModule } from '@angular/material/icon';
import { Component, HostListener, inject, Input } from '@angular/core';
import { SnackBarService } from '../snack-bar.service';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-documents-form-control',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DocumentsFormControlComponent,
      multi: true
    }
  ],
  templateUrl: './documents-form-control.component.html',
  styleUrl: './documents-form-control.component.css'
})
export class DocumentsFormControlComponent {
  @Input() width = '100%';
  @Input() height = '290px';
  @Input({ required: true }) imageSwitch!: boolean;
  
  private readonly _snackBar = inject(SnackBarService);

  public validFile: File[] = []
  public arrDocumentSrc: string[] = []

  private onChange: (value: any) => void = () => {}

  private onTouched: Function = () => {}
  protected disabled: boolean | undefined

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn
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
      this.arrDocumentSrc = value.map(filename =>
        `http://localhost:3000/videos/${filename}`
      );
    } else {
      this.arrDocumentSrc = [];
    }
  }

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    $event.preventDefault();

    if ($event.dataTransfer?.files) {
      const file = $event.dataTransfer;
      this.onDocumentSelect(file)
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    $event.preventDefault()
  }

  protected onDocumentSelect(event: Event | DataTransfer) {
    let fileList: FileList | null = null;
    let fileInput: HTMLInputElement | undefined;

    if (event instanceof DataTransfer) {
      fileList = event.files;
    } else {
      fileInput = event.target as HTMLInputElement;
      fileList = fileInput.files;
    }

    if (!fileList || fileList.length === 0) return 

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);

      if (file && this.validationDocument(file)) {
        this.validFile.push(file);
      }
    }

    if (fileInput) fileInput.value = '';
    this.onChange?.(this.validFile);
  }

  validationDocument(file: File): boolean {
    if (!file) return false;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      this._snackBar.openSnarkBar('Uno de los elementos seleccionado no es un video valido')
      return false
    }

    return true;
  }

  removeDocumen(index: number): void {
    this.validFile.splice(index, 1)
    this.onChange?.(this.validFile)
  }

  
}
