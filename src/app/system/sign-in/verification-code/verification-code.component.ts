//Angular import
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-verification-code',
  standalone: true,
  imports: [ 
    FormsModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
  ],
  templateUrl: './verification-code.component.html',
  styleUrl: './verification-code.component.scss'
})

export class VerificationCodeComponent {
  userCode: string[] = ['','','','','',''];
  @ViewChildren('codeInput') inputs!: QueryList<ElementRef>;

  focusNext(index: number): void {
    const inputNext = this.inputs.toArray()

    if (inputNext[index].nativeElement.value === '') return
    if (inputNext[index + 1])  {
      inputNext[index + 1].nativeElement.focus();
    } 
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const inputsArray  = this.inputs.toArray()

    if (event.key == "Backspace") {
      const inputValue = inputsArray[index].nativeElement;

      if (inputValue.value == '' && index > 0) {
        inputsArray [index-1].nativeElement.focus()
      }
    }
    
  }

  verifyCode() {

  }
}
