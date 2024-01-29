import { Injectable } from '@angular/core';
import { Card, CardNumber, GameSlots, SolveFrom } from '../../types';
import { DECKS, DECK_SIZE } from '../../constants';
import { DeckService } from '../deck/deck.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  /** component constructor */
  constructor(
    private deckService: DeckService,
  ) { /* do nothig */ }

  hasPiles(game: GameSlots): boolean {
    const pilesLength = game.piles.length;
    for (let x = 0; x < pilesLength; x++) {
      if (game.piles[x].length > 0) {
        return false;
      }
    }
    return true;
  }

  solveNext(game: GameSlots): GameSlots { // search next card to solve
    // search for every foundation or fold stock
    const foundationsLength = game.foundations.length;
    for (let x = 0; x < foundationsLength; x++) {
      const objective = this.getCardObjective(game.foundations[x]);
      if (objective) {
        const solveFrom = this.getPostion(game, objective);
        if (solveFrom) {
          return this.deckService.solve(game, solveFrom);
        }
      }
    }

    // maybe there is a empty foundation ? try to get any A card
    const solveFrom = this.getFirstCardObjective(game);
    if (solveFrom) {
      return this.deckService.solve(game, solveFrom);
    }

    return this.deckService.solveStock(game);
  }

  getFirstCardObjective(game: GameSlots): SolveFrom | null {
    const cards: Card[] = DECKS.map(d => ({ color: d.color, type: d.type, number: 1 }));
    const cardsLength = cards.length;
    for (let x = 0; x < cardsLength; x++) {
      const position = this.getPostion(game, cards[x]);
      if (position) {
        return position;
      }
    }
    return null;
  }

  getPostion(game: GameSlots, card: Card): SolveFrom | null {
    if (this.deckService.isSameCard(game.activeStock.slice(-1).shift(), card)) return { prop: 'activeStock' };

    const solvedPilesLength = game.solvedPiles.length;
    for (let x = 0; x < solvedPilesLength; x++) {
      if (this.deckService.isSameCard(game.solvedPiles[x].slice(-1).shift(), card)) {
        return { prop: 'solvedPiles', pileIndex: x };
      }
    }

    return null;
  }

  getCardObjective(pile: Card[]): Card | null {
    if (pile.length > 0) {
      const card = pile[pile.length - 1];
      if (card && card.number < DECK_SIZE) {
        return { color: card.color, type: card.type, number: card.number + 1 as CardNumber };
      }
    }
    return null;
  }

  isGameEnded(game: GameSlots): boolean {
    return this.arePilesEmpty(game.piles) && this.arePilesEmpty(game.solvedPiles) &&
      this.isPileEmpty(game.stock) && this.isPileEmpty(game.activeStock);
  }

  isStockEnded(game: GameSlots): boolean {
    return this.isPileEmpty(game.activeStock) && this.isPileEmpty(game.stock);
  }

  isPileEmpty(pile: Card[]): boolean {
    return pile.length === 0;
  }

  arePilesEmpty(piles: Card[][]): boolean {
    const pilesLength = piles.length;
    for (let x = 0; x < pilesLength; x++) {
      if (piles[x].length > 0) {
        return false;
      }
    }
    return true;
  }
}
