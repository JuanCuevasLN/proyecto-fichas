import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CreationAndUpdateFichasComponent } from './creation-and-update-fichas/creation-and-update-fichas.component';

@Component({
  selector: 'app-fichas',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './fichas.component.html',
  styleUrl: './fichas.component.css'
})
export class FichasComponent {
  private dialog:MatDialog = inject(MatDialog)

  openFicasCreationAndUpdateDialog() {
    this.dialog.open(CreationAndUpdateFichasComponent, {
      panelClass: 'dialog-responsive',
      width: '830px',
      disableClose: true
    })
  }
}
