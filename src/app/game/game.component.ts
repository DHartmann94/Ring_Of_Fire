import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, addDoc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();

  //game$: Observable<any>;
  //gameBackend:Array<any> = [];
  //firestore: Firestore = inject(Firestore);

  gameId: string = '';


  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore) {

  }

  // 6WphozGrgwZ2lrUH7v4J
  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      console.log('ID: ',this.gameId);

      const itemCollection = collection(this.firestore, 'games');
      const documentReference = doc(itemCollection, this.gameId);
      docData(documentReference).subscribe((game: any) => {
        console.log(game);

        this.game.currentPlayer = game['currentPlayer'];
        this.game.playedCards = game['playedCards'];
        this.game.players = game['players'];
        this.game.stack = game['stack'];
      });
      //this.game$ = collectionData(itemCollection);

      /*this.game$.subscribe((gameNewItem) => {
        this.gameBackend = gameNewItem;
        console.log('Ergenisse', this.gameBackend);
      })*/
    })
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()!; // pop gives the last value from the array and delete it
      this.pickCardAnimation = true;
      this.saveGame();

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent); //Where to open the dialog container

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
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