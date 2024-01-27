import { TestBed } from '@angular/core/testing';
import { GameSlots, Card, CardColor, CardType, CardNumber } from '../../types';
import { CardColorL, CardTypeL } from '../../constants';

import { DeckService } from './deck.service';

const getEmptyGameSlots = (): GameSlots => {
  return {
    stock: [],
    activeStock: [],
    solvedPiles: [[]],
    piles: [[]],
    foundations: [[]],
  };
};

const card = (color: CardColor, type: CardType, number: CardNumber): Card => ({ color, type, number });

fdescribe('DeckService', () => {
  let service: DeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should solve the A to 1st foundation', () => {
    expect(service.solveCard(getEmptyGameSlots(), card(CardColorL.red, CardTypeL.heart, 1))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      foundations: [[card(CardColorL.red, CardTypeL.heart, 1)]],
    });
  });

  it('should solve the A to 2nd foundation', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[card(CardColorL.red, CardTypeL.heart, 1)], []];

    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.club, 1))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      foundations: [[card(CardColorL.red, CardTypeL.heart, 1)], [card(CardColorL.red, CardTypeL.club, 1)]],
    });
  });

  it('should solve the A to 1st foundation', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [card(CardColorL.red, CardTypeL.heart, 1)]];

    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.club, 1))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      foundations: [[card(CardColorL.red, CardTypeL.club, 1)], [card(CardColorL.red, CardTypeL.heart, 1)]],
    });
  });

  it('should not solve the A if there is no empty foundation', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[card(CardColorL.red, CardTypeL.heart, 1)], [card(CardColorL.red, CardTypeL.heart, 1)]];

    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.club, 1))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      foundations: [[card(CardColorL.red, CardTypeL.heart, 1)], [card(CardColorL.red, CardTypeL.heart, 1)]],
    });
  });

  it('should solve the K to 1st solved pile', () => {
    expect(service.solveCard(getEmptyGameSlots(), card(CardColorL.red, CardTypeL.heart, 13))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      solvedPiles: [[card(CardColorL.red, CardTypeL.heart, 13)]],
    });
  });

  it('should solve the K to 2nd solved pile', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.solvedPiles = [[card(CardColorL.red, CardTypeL.heart, 12)], []];
    game.piles = [[], []];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.heart, 13))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      piles: [[], []],
      solvedPiles: [[card(CardColorL.red, CardTypeL.heart, 12)], [card(CardColorL.red, CardTypeL.heart, 13)]],
    });
  });

  it('should not solve the K', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.solvedPiles = [[card(CardColorL.red, CardTypeL.heart, 13)], [card(CardColorL.red, CardTypeL.heart, 13)]];
    game.piles = [[], []];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.club, 13))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      piles: [[], []],
      solvedPiles: [[card(CardColorL.red, CardTypeL.heart, 13)], [card(CardColorL.red, CardTypeL.heart, 13)]],
    });
  });
});
