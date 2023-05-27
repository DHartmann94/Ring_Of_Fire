import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();

  game$: Observable<any>;
  gameBackend:Array<any> = [];
  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) {
    const itemCollection = collection(this.firestore, 'games');
    this.game$ = collectionData(itemCollection);
  }

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();

    this.game$.subscribe((gameNewItem) => {
      this.gameBackend = gameNewItem;
      console.log('Ergenisse', this.gameBackend);
    })

    const itemCollection = collection(this.firestore, 'games');
    //let gameInfo = addDoc(itemCollection, {game: this.game.toJSON()});
    //console.log(gameInfo);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()!; // pop gives the last value from the array and delete it
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent); //Where to open the dialog container

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}