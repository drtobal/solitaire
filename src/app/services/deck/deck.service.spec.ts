import { TestBed } from '@angular/core/testing';
import { GameSlots, Card, CardType, CardNumber, DeckDefinition } from '../../types';
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

const cloneGame = (game: GameSlots): GameSlots => JSON.parse(JSON.stringify(game));

const card = (type: CardType, number: CardNumber): Card => {
  let color = CardColorL.black;
  switch (type) {
    case 'diamond':
    case 'heart':
      color = CardColorL.red;
      break;
  }
  return { color, type, number };
};

describe('DeckService', () => {
  const red = CardColorL.red;
  const black = CardColorL.black;
  const diamond = CardTypeL.diamond;
  const club = CardTypeL.club;
  const spade = CardTypeL.spade;
  const heart = CardTypeL.heart;

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
    let cards = [];
    for (let x = 1; x <= 10; x++) {
      cards.push(card(heart, x as CardNumber));
    }
    expect(service.generatePiles([])).toBeDefined();
    expect(service.generatePiles(cards, 4)).toEqual({
      piles: [
        [],
        [card(heart, 3)],
        [card(heart, 5), card(heart, 6)],
        [card(heart, 8), card(heart, 9), card(heart, 10)],
      ],
      solvedPiles: [
        [card(heart, 1)],
        [card(heart, 2)],
        [card(heart, 4)],
        [card(heart, 7)],
      ],
      mod: [],
    });

    cards = [];
    for (let x = 22; x <= 100; x++) {
      cards.push(card(heart, x as CardNumber));
    }

    const mod: Card[] = [];
    for (let x = 37; x <= 100; x++) {
      mod.push(card(heart, x as CardNumber));
    }

    expect(service.generatePiles(cards, 5)).toEqual({
      piles: [
        [],
        [card(heart, 24 as any)],
        [card(heart, 26 as any), card(heart, 27 as any)],
        [card(heart, 29 as any), card(heart, 30 as any), card(heart, 31 as any)],
        [card(heart, 33 as any), card(heart, 34 as any), card(heart, 35 as any), card(heart, 36 as any)],
      ],
      solvedPiles: [
        [card(heart, 22 as any)],
        [card(heart, 23 as any)],
        [card(heart, 25 as any)],
        [card(heart, 28 as any)],
        [card(heart, 32 as any)],
      ],
      mod,
    });
  });

  it('should generate multiple decks', () => {
    const definitions: DeckDefinition[] = [
      { color: black, type: club },
      { color: red, type: diamond },
    ];
    expect(service.generateDecks(definitions).length).toBeGreaterThan(1);
    expect(service.generateDecks(definitions, 3)).toEqual([
      card(club, 1),
      card(club, 2),
      card(club, 3),
      card(diamond, 1),
      card(diamond, 2),
      card(diamond, 3),
    ]);
  });

  it('should generate a deck', () => {
    expect(service.generateDeck(spade, black).length).toBeGreaterThan(1);
    expect(service.generateDeck(spade, black, 4)).toEqual([card(spade, 1), card(spade, 2), card(spade, 3), card(spade, 4)]);
  });

  it('should not solve empty card', () => {
    expect(service.solveCard(getEmptyGameSlots(), null)).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
    });
  });

  it('should solve the A to 1st foundation', () => {
    expect(service.solveCard(getEmptyGameSlots(), card(heart, 1))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      foundations: [[card(heart, 1)]],
    });
  });

  it('should solve the A to 2nd foundation', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[card(heart, 1)], []];

    expect(service.solveCard(game, card(club, 1))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      foundations: [[card(heart, 1)], [card(club, 1)]],
    });
  });

  it('should solve the A to 1st foundation B', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [card(heart, 1)]];

    expect(service.solveCard(game, card(club, 1))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      foundations: [[card(club, 1)], [card(heart, 1)]],
    });
  });

  it('should not solve the A if there is no empty foundation', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[card(heart, 1)], [card(diamond, 1)]];

    expect(service.solveCard(game, card(club, 1))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      foundations: [[card(heart, 1)], [card(diamond, 1)]],
    });
  });

  it('should solve the K to 1st solved pile', () => {
    expect(service.solveCard(getEmptyGameSlots(), card(heart, 13))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      solvedPiles: [[card(heart, 13)]],
    });
  });

  it('should solve the K to 2nd solved pile', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.solvedPiles = [[card(heart, 12)], []];
    game.piles = [[], []];
    expect(service.solveCard(game, card(heart, 13))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      piles: [[], []],
      solvedPiles: [[card(heart, 12)], [card(heart, 13)]],
    });
  });

  it('should not solve the K', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.solvedPiles = [[card(heart, 13)], [card(diamond, 13)]];
    game.piles = [[], []];
    expect(service.solveCard(game, card(club, 13))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      piles: [[], []],
      solvedPiles: [[card(heart, 13)], [card(diamond, 13)]],
    });
  });

  it('should solve consecutive foundation 1 -> 2', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [], [card(heart, 1)], []];
    expect(service.solveCard(game, card(heart, 2))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      foundations: [[], [], [card(heart, 1), card(heart, 2)], []],
    });
  });

  it('should not solve consecutive foundation 1 -> 2, different type', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [card(heart, 1)], []];
    expect(service.solveCard(game, card(club, 2))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      foundations: [[], [card(heart, 1)], []],
    });
  });

  it('should not solve consecutive foundation 9 -> 11, different greather number', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [card(heart, 9)], []];
    expect(service.solveCard(game, card(heart, 11))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      foundations: [[], [card(heart, 9)], []],
    });
  });

  it('should not solve consecutive foundation 9 -> 3, different lower number', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.foundations = [[], [card(spade, 9)], []];
    expect(service.solveCard(game, card(spade, 3))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      foundations: [[], [card(spade, 9)], []],
    });
  });

  it('should solve consecutive to pile 1 -> 2', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.piles = [[]];
    game.solvedPiles = [[card(club, 1)]];
    expect(service.solveCard(game, card(diamond, 2))).toEqual({
      ...getEmptyGameSlots(),
      moved: true,
      solvedPiles: [[card(club, 1), card(diamond, 2)]],
    });
  });

  it('should NOT solve consecutive to pile 4 -> 5, same color', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.piles = [[], []];
    game.solvedPiles = [[], [card(club, 4)]];
    expect(service.solveCard(game, card(spade, 5))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      piles: [[], []],
      solvedPiles: [[], [card(club, 4)]],
    });
  });

  it('should not solve consecutive to pile 1 -> 4, different greather number', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.piles = [[]];
    game.solvedPiles = [[card(club, 1)]];
    expect(service.solveCard(game, card(diamond, 4))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      solvedPiles: [[card(club, 1)]],
    });
  });

  it('should not solve consecutive to pile 5 -> 2, different lower number', () => {
    const game: GameSlots = getEmptyGameSlots();
    game.piles = [[]];
    game.solvedPiles = [[card(club, 5)]];
    expect(service.solveCard(game, card(diamond, 2))).toEqual({
      ...getEmptyGameSlots(),
      moved: false,
      solvedPiles: [[card(club, 5)]],
    });
  });

  fit('should play a copy of a real game', () => {
    let game: GameSlots = getEmptyGameSlots();
    let snapshot: GameSlots = cloneGame(game);
    game.foundations = [[], [], [], []];
    game.piles = [
      [],
      [],
      [card(heart, 4)],
      [],
      [card(club, 9), card(club, 12), card(heart, 2)],
      [],
      [card(spade, 11), card(club, 1)],
    ];
    game.stock = [
      card(heart, 5),
    ];
    game.solvedPiles = [
      [card(diamond, 10)],
      [card(heart, 13)],
      [card(heart, 1)],
      [card(club, 11)],
      [card(spade, 1)],
      [card(diamond, 3)],
      [card(heart, 8)],
    ];


    snapshot = cloneGame(game);
    game = service.solveGame(game, 'solvedPiles', 2);
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations[0]).toEqual([card(heart, 1)]);
    expect(game.solvedPiles[2]).toEqual([card(heart, 4)]);

    snapshot = cloneGame(game);
    game = service.solveGame(game, 'solvedPiles', 4);
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations[1]).toEqual([card(spade, 1)]);
    expect(game.solvedPiles[4]).toEqual([card(heart, 2)]);

    snapshot = cloneGame(game);
    game = service.solveGame(game, 'solvedPiles', 4);
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations[0]).toEqual([card(heart, 1), card(heart, 2)]);
    expect(game.solvedPiles[4]).toEqual([card(club, 12)]);

    snapshot = cloneGame(game);
    game = service.solveGame(game, 'solvedPiles', 4);
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations).toEqual(snapshot.foundations)
    expect(game.solvedPiles[1]).toEqual([card(heart, 13), card(club, 12)]);

    snapshot = cloneGame(game);
    game = service.solveGame(game, 'solvedPiles', 6);
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.solvedPiles[4]).toEqual([card(club, 9), card(heart, 8)]);

    snapshot = cloneGame(game);
    game = service.solveGame(game, 'solvedPiles', 6);
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations[2]).toEqual([card(club, 1)]);
    expect(game.solvedPiles).not.toEqual(snapshot.solvedPiles);

    snapshot = cloneGame(game);
    game = service.solveGame(game, 'solvedPiles', 5); //not allowed
    expect(game).toEqual({ ...snapshot, moved: false } as any);

    snapshot = cloneGame(game);
    game = service.solveGame(game, 'stock');
    expect(game.activeStock).toEqual([card(heart, 5)]);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.stock).not.toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.solvedPiles).toEqual(snapshot.solvedPiles);

    snapshot = cloneGame(game);
    game = service.solveGame(game, 'solvedPiles', 0);
    expect(game.solvedPiles[0]).toEqual([]);
    expect(game.solvedPiles[3]).toEqual([card(club, 11), card(diamond, 10)]);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
  });
});
