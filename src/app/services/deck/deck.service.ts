import { Injectable } from '@angular/core';
import { Card, CardColor, CardNumber, CardType, GameMoved, GameSlots } from '../../types';
import { CardColorL, CardTypeL, DECKS, DECK_SIZE, PILES } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  /** suffle the array - modern version of the Fisher–Yates shuffle */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  consecutiveArray(from: number, to: number): number[] {
    const result: number[] = [];
    for (let x = from; x <= to; x++) {
      result.push(x);
    }
    return result;
  }

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

  getLastCardFromPiles(...piles: Card[][]): Card | null {
    for (let x = piles.length - 1; x >= 0; x--) {
      if (piles[x].length > 0) {
        return piles[x][piles[x].length - 1];
      }
    }
    return null;
  }

  solveCard(slots: GameSlots, card?: Card | null): GameMoved {
    if (!card) return { ...slots, moved: false };

    let result = this.addCardToFoundations(slots, card);
    if (result.moved) return result;

    result = this.addCardToEmptyPiles(slots, card);
    if (result.moved) return result;

    result = this.addCardToPiles(slots, card);
    if (result.moved) return result;

    return { ...slots, moved: false };
  }

  addCardToFoundations(slots: GameSlots, card: Card): GameMoved {
    const foundationsLength = slots.foundations.length;
    for (let x = 0; x < foundationsLength; x++) {
      const result = this.addToPile(slots.foundations[x], card, true);
      if (result.moved) {
        slots.foundations[x] = [...result.pile];
        return { ...slots, moved: true };
      }
    }
    return { ...slots, moved: false };
  }

  addCardToEmptyPiles(slots: GameSlots, card: Card): GameMoved {
    if (card.number === 13) { // kaysers can be placed on empty slots
      const pilesLength = slots.piles.length;
      for (let x = 0; x < pilesLength; x++) {
        if (slots.piles[x].length === 0 && slots.solvedPiles[x].length === 0) {
          slots.solvedPiles[x] = [card];
          return { ...slots, moved: true };
        }
      }
    }
    return { ...slots, moved: false };
  }

  addCardToPiles(slots: GameSlots, card: Card): GameMoved {
    // solve in random order
    const indexes = this.shuffle(this.consecutiveArray(0, slots.solvedPiles.length - 1));
    for (let x = 0; x < slots.piles.length; x++) {
      const index = indexes[x];
      const result = this.addToPile(slots.solvedPiles[index], card);
      if (result.moved) {
        slots.solvedPiles[index] = [...slots.solvedPiles[index]];
        return { ...slots, moved: true };
      }
    }
    return { ...slots, moved: false };
  }

  addToPile(pile: Card[], card: Card, sameColor: boolean = false): { pile: Card[], card: Card, moved: boolean } {
    let moved: boolean = false;
    if (pile.length > 0) {
      const lastCard = pile[pile.length - 1];
      if (this.isConsecutive(lastCard, card, sameColor)) {
        pile.push(card);
        moved = true;
      }
    } else if (this.isFirstCard(card, sameColor)) {
      pile.push(card);
      moved = true;
    }
    return { pile, card, moved };
  }

  isFirstCard(card: Card, sameColor: boolean): boolean {
    if (sameColor) {
      return card.number === 1;
    }
    return card.number === 13;
  }

  isConsecutive(a: Card, b: Card, sameColor: boolean = false): boolean {
    if (sameColor) {
      return this.isConsecutiveFoundation(a, b);
    }
    return this.isConsecutivePile(a, b);
  }

  isConsecutiveFoundation(a: Card, b: Card): boolean {
    return a.number + 1 === b.number && a.type === b.type;
  }

  isConsecutivePile(a: Card, b: Card): boolean {
    return a.number - 1 === b.number && a.color !== b.color;
  }
}
