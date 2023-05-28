import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, addDoc, docData, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { PlayerEditComponent } from '../player-edit/player-edit.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: Game = new Game();

  gameId: string = '';


  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore) {

  }


  ngOnInit(): void {
    this.newGame();
    this.loadGameDataFromDatabase();
  }

  newGame() {
    this.game = new Game();
  }

  loadGameDataFromDatabase() {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];

      const itemCollection = collection(this.firestore, 'games');
      const documentReference = doc(itemCollection, this.gameId);
      docData(documentReference).subscribe((game: any) => {
        this.game.currentPlayer = game['currentPlayer'];
        this.game.playedCards = game['playedCards'];
        this.game.players = game['players'];
        this.game.playerImages = game['playerImages'];
        this.game.stack = game['stack'];
        this.game.pickCardAnimation = game['pickCardAnimation'];
        this.game.currentCard = game['currentCard'];
        this.game.gameOver = game['gameOver'];
      });
    })
  }

  takeCard() {
    if (this.game.players.length == 0) {
      alert('Please create a Player!');
    } else if (this.game.stack.length == 0) {
      this.game.gameOver = true;
      this.saveGame();
    } else if (!this.game.pickCardAnimation && this.game.players.length > 0) {
      this.processTakeCard();
    }
  }

  processTakeCard() {
    this.game.currentCard = this.game.stack.pop()!; // pop gives the last value from the array and delete it
    this.game.pickCardAnimation = true;

    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    this.saveGame();
    setTimeout(() => {
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent); //Where to open the dialog container

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('player_m.png');
        this.saveGame();
      }
    });
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(PlayerEditComponent); //Where to open the dialog container

    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

  /**
   * Saves the changes in the backend
   */
  async saveGame() {
    const itemCollection = collection(this.firestore, 'games');
    const documentReference = doc(itemCollection, this.gameId);

    await updateDoc(documentReference, this.game.toJSON());
  }
}