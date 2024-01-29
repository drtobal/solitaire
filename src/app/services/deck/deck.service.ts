import { Injectable } from '@angular/core';
import { Card, CardColor, CardNumber, CardType, DeckDefinition, FullCameMoved, GameSlots, SolveFrom, SolveTo, SpliceCards } from '../../types';
import { DECKS, DECK_SIZE, PILES } from '../../constants';
import { UtilService } from '../util/util.service';

/** functions to work with decks and cards */
@Injectable({
  providedIn: 'root'
})
export class DeckService {
  /** solve a movement if it's a valid move */
  solve(game: GameSlots, from: SolveFrom, to: SolveTo | null = null): FullCameMoved {
    const spliced = this.spliceCards(game, from);
    if (spliced.cards.length === 0) return { ...game, spliced, moved: false };
    if (to !== null) {
      if (!this.isDropValid(game, spliced.cards[0], to)) return { ...game, spliced, moved: false };
    } else {
      to = this.getDroppableStock(game, spliced.cards[0], spliced.cards.length > 1);
    }

    if (to === null) return { ...game, spliced, moved: false };

    return { ...this.makeMove(game, from, spliced, to), spliced, to, moved: true };
  }

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

  /** generate a consecutive array from from to to included */
  consecutiveArray(from: number, to: number): number[] {
    const result: number[] = [];
    for (let x = from; x <= to; x++) {
      result.push(x);
    }
    return result;
  }

  /** generate a random cards game, TODO: imeplement a algorithm to make winnable games */
  generateGame(): GameSlots {
    const pilesResult = this.generatePiles(this.shuffle(this.generateDecks(DECKS, DECK_SIZE)), PILES);
    const gameSlots = {
      stock: pilesResult.mod,
      activeStock: [],
      piles: pilesResult.piles,
      solvedPiles: pilesResult.solvedPiles,
      foundations: this.fillArray<Card>([], DECKS.length),
    };
    return gameSlots;
  }

  /** generate piles using solitaire pile format */
  generatePiles(cards: Card[], length: number): { piles: Card[][], solvedPiles: Card[][], mod: Card[] } {
    const piles = this.fillArray<Card>([], length);
    const solvedPiles = this.fillArray<Card>([], length);
    for (let x = 0; x < length; x++) {
      solvedPiles[x].push(cards.shift()!);
      piles[x] = cards.splice(0, x);
    }
    return { piles, solvedPiles, mod: cards };
  }

  /** fill a array with n empty arrays */
  fillArray<T>(arr: T[][], length: number): T[][] {
    const diff = length - arr.length;
    for (let x = 0; x < diff; x++) {
      arr.push([]);
    }
    return arr;
  }

  /** generate decks, normal is to 4 decks */
  generateDecks(definitions: DeckDefinition[], size: number): Card[] {
    let decks: Card[] = [];
    const decksLength = definitions.length;
    for (let x = 0; x < decksLength; x++) {
      decks = decks.concat(this.generateDeck(definitions[x].type, definitions[x].color, size));
    }
    return decks;
  }

  /** generate a single deck of cards from 1 to size, normal is 13 cards per deck */
  generateDeck(type: CardType, color: CardColor, size: number): Card[] {
    const deck: Card[] = [];
    for (let number = 1; number <= size; number++) {
      deck.push({ number: number as CardNumber, color, type });
    }
    return deck;
  }

  /** check if requested move is valid */
  isValidMove(a: Card, b: Card, isFoundation: boolean): boolean {
    if (!a || !b) return false;

    if (isFoundation) return a.number + 1 === b.number && a.type === b.type;

    return a.number - 1 === b.number && a.color !== b.color;
  }

  /** apply move from stock to solve stock, or reverse all the solve stock to stock again */
  solveStock(_game: GameSlots): GameSlots {
    const game = UtilService.deepClone(_game);
    if (game.stock.length > 0) {
      game.activeStock.push(game.stock.pop()!);
      game.activeStock = [...game.activeStock];
      game.stock = [...game.stock];
    } else {
      game.stock = game.activeStock.reverse();
      game.activeStock = [];
    }
    return game;
  }

  /** move cards from from to to */
  makeMove(game: GameSlots, from: SolveFrom, spliced: SpliceCards, to: SolveTo): GameSlots {
    game[from.prop] = [...spliced.game[from.prop] as Card[] & Card[][]];
    game[to.prop][to.index] = [...game[to.prop][to.index].concat(spliced.cards)];

    if (from.prop === 'solvedPiles' && game.solvedPiles[from.pileIndex].length === 0 &&
      game.piles[from.pileIndex].length > 0) {
      // auto fold pile
      const card = game.piles[from.pileIndex].pop();
      game.solvedPiles[from.pileIndex].push(card!);
      game.solvedPiles = [...game.solvedPiles];
      game.piles = UtilService.deepClone(game.piles);
    }

    return game;
  }

  /** check if drop requested is valid */
  isDropValid(game: GameSlots, card: Card, to: SolveTo): boolean {
    switch (to.prop) {
      case 'foundations':
        return this.isDropValidFoundation(game, card, to);
      case 'solvedPiles':
        return this.isDropValidSolvedPiles(game, card, to);
    }
  }

  /** check if drop requested is valid when try to drop on a foundation pile */
  isDropValidFoundation(game: GameSlots, card: Card, to: SolveTo): boolean {
    const pile = game.foundations[to.index];
    if (!Array.isArray(pile)) return false;

    if (pile.length === 0 && card.number === 1) return true;

    return this.isValidMove(pile[pile.length - 1], card, true);
  }

  /** check if drop requested is valid when try to drop on a solved pile */
  isDropValidSolvedPiles(game: GameSlots, card: Card, to: SolveTo): boolean {
    const pile = game.solvedPiles[to.index];
    if (!Array.isArray(pile)) return false;

    if (pile.length === 0 && game.piles[to.index].length === 0 && card.number === 13) return true;

    return this.isValidMove(pile[pile.length - 1], card, false);
  }

  /** finds a pile to drop the given card */
  getDroppableStock(game: GameSlots, card: Card, skipFoundation: boolean): SolveTo | null {
    let index = -1;
    if (!skipFoundation) {
      index = this.getDroppableFoundation(game, card);
      if (index > -1) return { prop: 'foundations', index };
    }

    index = this.getDroppableSolvedPile(game, card);
    if (index > -1) return { prop: 'solvedPiles', index };

    return null;
  }

  /** finds a solved pile to drop the given card */
  getDroppableSolvedPile(game: GameSlots, card: Card): number {
    const length = game.solvedPiles.length;
    const indexes = this.shuffle(this.consecutiveArray(0, length - 1));

    for (let x = 0; x < length; x++) {
      const pile = game.solvedPiles[indexes[x]];
      if (pile.length === 0) {
        if (card.number === 13 && game.piles[indexes[x]].length === 0) { // empty slot and kayser
          return indexes[x];
        }
      } else if (this.isValidMove(pile[pile.length - 1], card, false)) {
        return indexes[x];
      }
    }
    return -1;
  }

  /** finds a foundation pile to drop the given card */
  getDroppableFoundation(game: GameSlots, card: Card): number {
    const foundationsLength = game.foundations.length;
    for (let x = 0; x < foundationsLength; x++) {
      if (game.foundations[x].length === 0 ? card.number === 1 :
        this.isValidMove(game.foundations[x][game.foundations[x].length - 1], card, true)) {
        return x;
      }
    }
    return -1;
  }

  /** splice cards from game given the from object */
  spliceCards(_game: GameSlots, from: SolveFrom): SpliceCards {
    const game = UtilService.deepClone(_game);
    switch (from.prop) {
      case 'activeStock':
        if (game.activeStock.length > 0) {
          const card = game.activeStock.pop();
          game.activeStock = [...game.activeStock];
          return { game, cards: [card!] };
        }
        return { game, cards: [] };
      case 'foundations':
      case 'solvedPiles':
        const pile = game[from.prop][from.pileIndex];
        const pileLength = pile.length;
        if (pileLength > 0) {
          if (from.prop === 'foundations') {
            const card = game.foundations[from.pileIndex].pop();
            game.foundations[from.pileIndex] = [...game.foundations[from.pileIndex]];
            return { game, cards: [card!] };
          }
          const cardIndex = typeof from.cardIndex !== 'undefined' && from.cardIndex > -1 ? from.cardIndex : pileLength - 1;
          const cards = pile.splice(cardIndex);
          game[from.prop][from.pileIndex] = [...game[from.prop][from.pileIndex]];
          return { game, cards };
        }
    }
    return { game, cards: [] };
  }

  /** check if a and b are the same card */
  isSameCard(a?: Card, b?: Card): boolean {
    return !!(a && b && a.color === b.color && a.number === b.number && a.type === b.type);
  }
}
