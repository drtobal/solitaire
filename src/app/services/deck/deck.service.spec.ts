import { TestBed } from '@angular/core/testing';
import { GameSlots, Card, CardColor, CardType, CardNumber, DeckDefinition } from '../../types';
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

describe('DeckService', () => {
  let service: DeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a array of n empty arrays', () => {
    expect(service.fillArray([], 3)).toEqual([[], [], []]);
  });

  it('should generate a game', () => {
    expect(service.generateGame()).toBeDefined();
  });

  it('should generate piles', () => {
    const color = CardColorL.black;
    const type = CardTypeL.spade;
    let cards = [];
    for (let x = 1; x <= 10; x++) {
      cards.push(card(color, type, x as CardNumber));
    }
    expect(service.generatePiles([])).toBeDefined();
    expect(service.generatePiles(cards, 4)).toEqual({
      piles: [
        [],
        [card(color, type, 3)],
        [card(color, type, 5), card(color, type, 6)],
        [card(color, type, 8), card(color, type, 9), card(color, type, 10)],
      ],
      solvedPiles: [
        [card(color, type, 1)],
        [card(color, type, 2)],
        [card(color, type, 4)],
        [card(color, type, 7)],
      ],
      mod: [],
    });

    cards = [];
    for (let x = 22; x <= 100; x++) {
      cards.push(card(color, type, x as CardNumber));
    }

    const mod: Card[] = [];
    for (let x = 37; x <= 100; x++) {
      mod.push(card(color, type, x as CardNumber));
    }
    
    expect(service.generatePiles(cards, 5)).toEqual({
      piles: [
        [],
        [card(color, type, 24 as any)],
        [card(color, type, 26 as any), card(color, type, 27 as any)],
        [card(color, type, 29 as any), card(color, type, 30 as any), card(color, type, 31 as any)],
        [card(color, type, 33 as any), card(color, type, 34 as any), card(color, type, 35 as any), card(color, type, 36 as any)],
      ],
      solvedPiles: [
        [card(color, type, 22 as any)],
        [card(color, type, 23 as any)],
        [card(color, type, 25 as any)],
        [card(color, type, 28 as any)],
        [card(color, type, 32 as any)],
      ],
      mod,
    });
  });

  it('should generate multiple decks', () => {
    const definitions: DeckDefinition[] = [
      { color: CardColorL.black, type: CardTypeL.heart },
      { color: CardColorL.red, type: CardTypeL.diamond },
    ];
    expect(service.generateDecks(definitions).length).toBeGreaterThan(1);
    expect(service.generateDecks(definitions, 3)).toEqual([
      card(CardColorL.black, CardTypeL.heart, 1),
      card(CardColorL.black, CardTypeL.heart, 2),
      card(CardColorL.black, CardTypeL.heart, 3),
      card(CardColorL.red, CardTypeL.diamond, 1),
      card(CardColorL.red, CardTypeL.diamond, 2),
      card(CardColorL.red, CardTypeL.diamond, 3),
    ]);
  });

  it('should generate a deck', () => {
    const color = CardColorL.black;
    const type = CardTypeL.spade;
    expect(service.generateDeck(type, color).length).toBeGreaterThan(1);
    expect(service.generateDeck(type, color, 4)).toEqual([
      card(color, type, 1),
      card(color, type, 2),
      card(color, type, 3),
      card(color, type, 4),
    ]);
  });

  it('should not solve empty card', () => {
    expect(service.solveCard(getEmptyGameSlots(), null)).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
    });
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

  it('should solve consecutive foundation 1 -> 2', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [], [card(CardColorL.red, CardTypeL.heart, 1)], []];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.heart, 2))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      foundations: [[], [], [card(CardColorL.red, CardTypeL.heart, 1), card(CardColorL.red, CardTypeL.heart, 2)], []],
    });
  });

  it('should not solve consecutive foundation 1 -> 2, different type', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [card(CardColorL.red, CardTypeL.heart, 1)], []];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.club, 2))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      foundations: [[], [card(CardColorL.red, CardTypeL.heart, 1)], []],
    });
  });

  it('should not solve consecutive foundation 9 -> 11, different greather number', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [card(CardColorL.red, CardTypeL.heart, 9)], []];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.heart, 11))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      foundations: [[], [card(CardColorL.red, CardTypeL.heart, 9)], []],
    });
  });

  it('should not solve consecutive foundation 9 -> 3, different lower number', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [card(CardColorL.red, CardTypeL.spade, 9)], []];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.spade, 3))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      foundations: [[], [card(CardColorL.red, CardTypeL.spade, 9)], []],
    });
  });

  it('should solve consecutive to pile 1 -> 2', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.piles = [[]];
    game.solvedPiles = [[card(CardColorL.black, CardTypeL.club, 1)]];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.diamond, 2))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      solvedPiles: [[card(CardColorL.black, CardTypeL.club, 1), card(CardColorL.red, CardTypeL.diamond, 2)]],
    });
  });

  it('should NOT solve consecutive to pile 4 -> 5, same color', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.piles = [[], []];
    game.solvedPiles = [[], [card(CardColorL.black, CardTypeL.club, 4)]];
    expect(service.solveCard(game, card(CardColorL.black, CardTypeL.spade, 5))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      piles: [[], []],
      solvedPiles: [[], [card(CardColorL.black, CardTypeL.club, 4)]],
    });
  });

  it('should solve consecutive to pile 1 -> 4, different greather number', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.piles = [[]];
    game.solvedPiles = [[card(CardColorL.black, CardTypeL.club, 1)]];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.diamond, 4))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      solvedPiles: [[card(CardColorL.black, CardTypeL.club, 1)]],
    });
  });

  it('should solve consecutive to pile 2 -> 5, different lower number', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.piles = [[]];
    game.solvedPiles = [[card(CardColorL.black, CardTypeL.club, 5)]];
    expect(service.solveCard(game, card(CardColorL.red, CardTypeL.diamond, 2))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      solvedPiles: [[card(CardColorL.black, CardTypeL.club, 5)]],
    });
  });
});
