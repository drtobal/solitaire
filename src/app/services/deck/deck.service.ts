import { Injectable } from '@angular/core';
import { Card, CardColor, CardNumber, CardType, DeckDefinition, GameMoved, GameSlots } from '../../types';
import { DECKS, DECK_SIZE, PILES } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  /** suffle the array - modern version of the Fisher–Yates shuffle */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
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
    const pilesResult = this.generatePiles(this.generateDecks(DECKS));
    const gameSlots = {
      stock: pilesResult.mod,
      activeStock: [],
      piles: pilesResult.piles,
      solvedPiles: pilesResult.solvedPiles,
      foundations: this.fillArray<Card>([], DECKS.length),
    };
    return gameSlots;
  }

  generatePiles(cards: Card[], length: number = PILES): { piles: Card[][], solvedPiles: Card[][], mod: Card[] } {
    const piles = this.fillArray<Card>([], length);
    const solvedPiles = this.fillArray<Card>([], length);
    for (let x = 0; x < length; x++) {
      solvedPiles[x].push(cards.shift()!);
      piles[x] = cards.splice(0, x);
    }
    return { piles, solvedPiles, mod: cards };
  }

  fillArray<T>(arr: T[][], length: number): T[][] {
    const diff = length - arr.length;
    for (let x = 0; x < diff; x++) {
      arr.push([]);
    }
    return arr;
  }

  generateDecks(definitions: DeckDefinition[], size: number = DECK_SIZE): Card[] {
    let decks: Card[] = [];
    const decksLength = definitions.length;
    for (let x = 0; x < decksLength; x++) {
      decks = decks.concat(this.generateDeck(definitions[x].type, definitions[x].color, size));
    }
    return decks;
  }

  generateDeck(type: CardType, color: CardColor, size: number = DECK_SIZE): Card[] {
    const deck: Card[] = [];
    for (let number = 1; number <= size; number++) {
      deck.push({ number: number as CardNumber, color, type });
    }
    return deck;
  }

  // getLastCardFromPiles(...piles: Card[][]): Card | null {
  //   for (let x = piles.length - 1; x >= 0; x--) {
  //     if (piles[x].length > 0) {
  //       return piles[x][piles[x].length - 1];
  //     }
  //   }
  //   return null;
  // }

  solveCard(slots: GameSlots, card?: Card | null): GameMoved {
    if (!card) return { ...slots, moved: false };

    console.log(1);
    let result = this.addCardToFoundations(slots, card);
    if (result.moved) return result;

    console.log(2);
    result = this.addCardToPiles(slots, card);
    if (result.moved) return result;

    console.log(3);
    return { ...slots, moved: false };
  }

  addCardToFoundations(slots: GameSlots, card: Card): GameMoved {
    const result = this.addFirstToFoundation(slots, card);
    if (result.moved) return result;

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

  addFirstToFoundation(slots: GameSlots, card: Card): GameMoved {
    if (card.number === 1) {
      const foundationsLength = slots.foundations.length;
      for (let x = 0; x < foundationsLength; x++) {
        if (slots.foundations[x].length === 0) {
          slots.foundations[x] = [card];
          return { ...slots, moved: true };
        }
      }
    }
    return { ...slots, moved: false };
  }

  addLastToPiles(slots: GameSlots, card: Card): GameMoved {
    if (card.number === DECK_SIZE) {
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
    const result = this.addLastToPiles(slots, card);
    if (result.moved) return result;

    // solve in random order
    const indexes = this.shuffle(this.consecutiveArray(0, slots.solvedPiles.length - 1));
    for (let x = 0; x < slots.piles.length; x++) {
      const index = indexes[x];
      const result = this.addToPile(slots.solvedPiles[index], card, false);
      if (result.moved) {
        slots.solvedPiles[index] = [...result.pile];
        return { ...slots, moved: true };
      }
    }
    return { ...slots, moved: false };
  }

  addToPile(pile: Card[], card: Card, foundation: boolean): { pile: Card[], card: Card, moved: boolean } {
    if (pile.length > 0 && this.isConsecutive(pile[pile.length - 1], card, foundation)) {
      pile.push(card);
      return { pile, card, moved: true };
    }
    return { pile, card, moved: false };
  }

  isConsecutive(a: Card, b: Card, foundation: boolean): boolean {
    if (a.number + 1 === b.number) {
      return foundation ? a.type === b.type : a.color !== b.color;
    }
    return false;

    // return sameColor ? a.number + 1 === b.number && a.type === b.type : a.number - 1 === b.number && a.color !== b.color;
  }

  // isConsecutiveFoundation(a: Card, b: Card): boolean {
  //   return a.number + 1 === b.number && a.type === b.type;
  // }

  // isConsecutivePile(a: Card, b: Card): boolean {
  //   return a.number - 1 === b.number && a.color !== b.color;
  // }
}
