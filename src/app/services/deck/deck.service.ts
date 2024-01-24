import { Injectable } from '@angular/core';
import { Card, CardColor, CardNumber, CardType, GameSlots } from '../../types';
import { CardColorL, CardTypeL, DECK_SIZE } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  generateGame(): GameSlots {
    const cards = this.generateDecks();
    const gameSlots = {
      stock: [],
      activeStock: [],
      piles: [[], [], [], [], [], [], []],
      foundations: [[], [], [], []],
    };
    return gameSlots;
  }

  generateDecks(): Card[] {
    let decks: Card[] = [];

    decks = decks.concat(this.generateDeck(CardTypeL.heart, CardColorL.red));
    decks = decks.concat(this.generateDeck(CardTypeL.diamond, CardColorL.red));
    decks = decks.concat(this.generateDeck(CardTypeL.spade, CardColorL.black));
    decks = decks.concat(this.generateDeck(CardTypeL.club, CardColorL.black));

    return decks;
  }

  generateDeck(type: CardType, color: CardColor): Card[] {
    const deck: Card[] = [];
    for (let number = 1; number <= DECK_SIZE; number++) {
      deck.push({ number: number as CardNumber, color, type });
    }
    return deck;
  }
}
