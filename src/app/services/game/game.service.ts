import { Injectable } from '@angular/core';
import { Card, CardNumber, GameSlots, SolveFrom } from '../../types';
import { DECKS, DECK_SIZE } from '../../constants';
import { DeckService } from '../deck/deck.service';

/** functions over cards but with a game point of view */
@Injectable({
  providedIn: 'root'
})
export class GameService {
  /** component constructor */
  constructor(
    private deckService: DeckService,
  ) { /* do nothig */ }

  /** returns false if there are any pile with cards */
  hasPiles(game: GameSlots): boolean {
    const pilesLength = game.piles.length;
    for (let x = 0; x < pilesLength; x++) {
      if (game.piles[x].length > 0) {
        return false;
      }
    }
    return true;
  }

  /** try to solve any next card, this is WIP to auto solve the game, not imeplemented yet */
  // solveNext(game: GameSlots): GameSlots { // search next card to solve
  //   // search for every foundation or fold stock
  //   const foundationsLength = game.foundations.length;
  //   for (let x = 0; x < foundationsLength; x++) {
  //     const objective = this.getCardObjective(game.foundations[x]);
  //     if (objective) {
  //       const solveFrom = this.getPosition(game, objective);
  //       if (solveFrom) {
  //         return this.deckService.solve(game, solveFrom);
  //       }
  //     }
  //   }

  //   // maybe there is a empty foundation ? try to get any A card
  //   const solveFrom = this.getFirstCardObjective(game);
  //   if (solveFrom) {
  //     return this.deckService.solve(game, solveFrom);
  //   }

  //   return this.deckService.solveStock(game);
  // }

  /** WIP: not implemented yet */
  // getFirstCardObjective(game: GameSlots): SolveFrom | null {
  //   const cards: Card[] = DECKS.map(d => ({ color: d.color, type: d.type, number: 1 }));
  //   const cardsLength = cards.length;
  //   for (let x = 0; x < cardsLength; x++) {
  //     const position = this.getPosition(game, cards[x]);
  //     if (position) {
  //       return position;
  //     }
  //   }
  //   return null;
  // }

  /** WIP: not implemented yet */
  // getPosition(game: GameSlots, card: Card): SolveFrom | null {
  //   if (this.deckService.isSameCard(game.activeStock.slice(-1).shift(), card)) return { prop: 'activeStock' };

  //   const solvedPilesLength = game.solvedPiles.length;
  //   for (let x = 0; x < solvedPilesLength; x++) {
  //     if (this.deckService.isSameCard(game.solvedPiles[x].slice(-1).shift(), card)) {
  //       return { prop: 'solvedPiles', pileIndex: x };
  //     }
  //   }

  //   return null;
  // }

  /** WIP: not implemented yet */
  // getCardObjective(pile: Card[]): Card | null {
  //   if (pile.length > 0) {
  //     const card = pile[pile.length - 1];
  //     if (card && card.number < DECK_SIZE) {
  //       return { color: card.color, type: card.type, number: card.number + 1 as CardNumber };
  //     }
  //   }
  //   return null;
  // }

  /** check if game is ended, when piles and stock are empty */
  isGameEnded(game: GameSlots): boolean {
    return this.arePilesEmpty(game.piles) && this.arePilesEmpty(game.solvedPiles) &&
      this.isPileEmpty(game.stock) && this.isPileEmpty(game.activeStock);
  }

  /** check if given pile is empty */
  isPileEmpty(pile: Card[]): boolean {
    return pile.length === 0;
  }

  /** check if array of piles are empty */
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
