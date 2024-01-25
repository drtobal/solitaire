import { Injectable } from '@angular/core';
import { Card, CardColor, CardNumber, CardType, GameSlots } from '../../types';
import { CardColorL, CardTypeL, DECKS, DECK_SIZE, PILES } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  generateGame(): GameSlots {
    let cards = this.generateDecks();
    const pilesResult = this.generatePiles(cards);
    cards = pilesResult.mod;
    const gameSlots = {
      stock: cards,
      activeStock: [],
      piles: pilesResult.piles,
      solvedPiles: pilesResult.solvedPiles,
      foundations: this.fillArray<Card>([], DECKS),
    };
    return gameSlots;
  }

  generatePiles(cards: Card[], length: number = PILES): { piles: Card[][], solvedPiles: Card[][], mod: Card[] } {
    const result = {
      piles: this.fillArray<Card>([], PILES),
      solvedPiles: this.fillArray<Card>([], PILES),
      mod: [] as Card[],
    };
    for (let x = 0; x < length; x++) {
      const first = cards.shift();
      if (first) {
        result.solvedPiles[x].push(first);
      }
      result.piles[x] = cards.splice(0, x);
    }
    result.mod = cards;
    return result;
  }

  fillArray<T>(arr: T[][], length: number): T[][] {
    const diff = length - arr.length;
    for (let x = 0; x < diff; x++) {
      arr.push([]);
    }
    return arr;
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
