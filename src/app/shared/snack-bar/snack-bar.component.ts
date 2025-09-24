import { Component, inject } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar'
@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackbarComponent {
  private _snackBar = inject(MatSnackBar)

  openSnackBar(message: string, action = 'OK'){
    this._snackBar.open(message, action, {
      duration: 3000, 
    })
  }
}
