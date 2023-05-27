import { Component } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent {
  name: String = '';


  /**
   * 
   * @public - With public you can access this variable from different components.
   * @param dialogRef - From the Angular-Material-Design (DialogRef comes from the DialogAddPlayerComponent)
   */
  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {
  }

  /**
   * Close the "Dialog Add Player" pop-up window.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

}
