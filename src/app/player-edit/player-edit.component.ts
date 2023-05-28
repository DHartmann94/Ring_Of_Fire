import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-player-edit',
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.scss']
})
export class PlayerEditComponent {
  allProfilePicture: Array<any> = ['player_m.png', 'player_w.png'];


  constructor(public dialogRef: MatDialogRef<PlayerEditComponent>) {
  }

    /**
   * Close the "Dialog Add Player" pop-up window.
   */
    onNoClick(): void {
      this.dialogRef.close();
    }

}
