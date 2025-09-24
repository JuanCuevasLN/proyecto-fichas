import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private _snackBar = inject(MatSnackBar)
  constructor() { }

  openSnarkBar(message: string, action = "OK"){
    this._snackBar.open(message, action, {
      duration: 4000
    })
  }
}
