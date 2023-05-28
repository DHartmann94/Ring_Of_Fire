import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection, setDoc, doc, addDoc, docData } from '@angular/fire/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(private router: Router, private firestore: Firestore) {}

  async newGame() {
    let game = new Game();
    const itemCollection = collection(this.firestore, 'games'); // Connects to the Firestore backend.
    let gameInfo = await addDoc(itemCollection, game.toJSON()); // Loads the game data (models/game) into the backend.

    this.router.navigateByUrl('/game/' + gameInfo.id); // Accesses the unique id in the backend and inserts this id into the url.
  }
}
