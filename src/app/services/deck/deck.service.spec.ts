import { TestBed } from '@angular/core/testing';
import { GameSlots, Card, CardType, CardNumber, DeckDefinition } from '../../types';
import { CardColorL, CardTypeL } from '../../constants';

import { DeckService } from './deck.service';

const emptyGame = (): GameSlots => {
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

const diamond = (n: number) => card(CardTypeL.diamond, n as CardNumber);
const heart = (n: number) => card(CardTypeL.heart, n as CardNumber);
const club = (n: number) => card(CardTypeL.club, n as CardNumber);
const spade = (n: number) => card(CardTypeL.spade, n as CardNumber);

describe('DeckService', () => {
  const redC = CardColorL.red;
  const blackC = CardColorL.black;
  const diamondT = CardTypeL.diamond;
  const clubT = CardTypeL.club;
  const spadeT = CardTypeL.spade;
  const heartT = CardTypeL.heart;

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
      cards.push(heart(x));
    }
    expect(service.generatePiles([], 7)).toBeDefined();
    expect(service.generatePiles(cards, 4)).toEqual({
      piles: [
        [],
        [heart(3)],
        [heart(5), heart(6)],
        [heart(8), heart(9), heart(10)],
      ],
      solvedPiles: [[heart(1)], [heart(2)], [heart(4)], [heart(7)]],
      mod: [],
    });

    cards = [];
    for (let x = 22; x <= 100; x++) {
      cards.push(heart(x));
    }

    const mod: Card[] = [];
    for (let x = 37; x <= 100; x++) {
      mod.push(heart(x));
    }

    expect(service.generatePiles(cards, 5)).toEqual({
      piles: [
        [],
        [heart(24)],
        [heart(26), heart(27)],
        [heart(29), heart(30), heart(31)],
        [heart(33), heart(34), heart(35), heart(36)],
      ],
      solvedPiles: [[heart(22)], [heart(23)], [heart(25)], [heart(28)], [heart(32)]],
      mod,
    });
  });

  it('should generate multiple decks', () => {
    const definitions: DeckDefinition[] = [
      { color: blackC, type: clubT },
      { color: redC, type: diamondT },
    ];
    expect(service.generateDecks(definitions, 13).length).toBeGreaterThan(1);
    expect(service.generateDecks(definitions, 3)).toEqual([
      club(1), club(2), club(3),
      diamond(1), diamond(2), diamond(3),
    ]);
  });

  it('should generate a deck', () => {
    expect(service.generateDeck(spadeT, blackC, 13).length).toBeGreaterThan(1);
    expect(service.generateDeck(spadeT, blackC, 4)).toEqual([spade(1), spade(2), spade(3), spade(4)]);
  });

  it('should check if is valid card', () => {
    expect(service.isValidMove(heart(2), heart(3), true)).toBeTrue();
    expect(service.isValidMove(heart(2), heart(4), true)).toBeFalse();
    expect(service.isValidMove(heart(2), heart(1), true)).toBeFalse();
    expect(service.isValidMove(heart(2), diamond(3), true)).toBeFalse();
    expect(service.isValidMove(heart(2), club(3), true)).toBeFalse();

    expect(service.isValidMove(heart(2), club(1), false)).toBeTrue();
    expect(service.isValidMove(heart(4), spade(3), false)).toBeTrue();
    expect(service.isValidMove(heart(4), diamond(3), false)).toBeFalse();
    expect(service.isValidMove(heart(4), heart(3), false)).toBeFalse();
    expect(service.isValidMove(heart(4), spade(5), false)).toBeFalse();
    expect(service.isValidMove(heart(4), spade(1), false)).toBeFalse();
    expect(service.isValidMove(heart(4), spade(9), false)).toBeFalse();
  });

  it('should return the index of droppable foundation', () => {
    let game = emptyGame();
    expect(service.getDroppableFoundation(game, diamond(1))).toBe(0);
    expect(service.getDroppableFoundation(game, diamond(2))).toBe(-1);

    game = { ...emptyGame(), ...{ foundations: [[], [diamond(1)]] } };
    expect(service.getDroppableFoundation(game, diamond(2))).toBe(1);

    game = { ...emptyGame(), ...{ foundations: [[], [diamond(1)]] } };
    expect(service.getDroppableFoundation(game, club(2))).toBe(-1);
    expect(service.getDroppableFoundation(game, diamond(3))).toBe(-1);
  });

  it('should return the index of droppable solved pile', () => {
    let game = emptyGame();
    expect(service.getDroppableSolvedPile(game, diamond(13))).toBe(0);
    expect(service.getDroppableSolvedPile(game, diamond(1))).toBe(-1);

    game = { ...emptyGame(), ...{ solvedPiles: [[], [club(9)]], piles: [[], []] } };
    expect(service.getDroppableSolvedPile(game, club(8))).toBe(-1);
    expect(service.getDroppableSolvedPile(game, diamond(8))).toBe(1);

    game = { ...emptyGame(), ...{ solvedPiles: [[], []], piles: [[heart(1)], [diamond(1)]] } };
    expect(service.getDroppableSolvedPile(game, club(13))).toBe(-1);
  });

  it('should check if drop action is valid', () => {
    let game = emptyGame();
    expect(service.isDropValid(game, diamond(1), { prop: 'foundations', index: 0 })).toBeTrue();
    expect(service.isDropValid(game, diamond(2), { prop: 'foundations', index: 0 })).toBeFalse();
    expect(service.isDropValid(game, diamond(2), { prop: 'foundations', index: 99 })).toBeFalse();

    game = { ...emptyGame(), ...{ foundations: [[], [club(3)]] } };
    expect(service.isDropValid(game, diamond(1), { prop: 'foundations', index: 1 })).toBeFalse();
    expect(service.isDropValid(game, club(4), { prop: 'foundations', index: 1 })).toBeTrue();

    game = { ...emptyGame(), ...{ piles: [[], []] }, solvedPiles: [[], []] };
    expect(service.isDropValid(game, diamond(1), { prop: 'solvedPiles', index: 1 })).toBeFalse();
    expect(service.isDropValid(game, diamond(13), { prop: 'solvedPiles', index: 1 })).toBeTrue();

    game = { ...emptyGame(), ...{ piles: [[heart(8)], [heart(7)]] }, solvedPiles: [[], []] };
    expect(service.isDropValid(game, club(13), { prop: 'solvedPiles', index: 1 })).toBeFalse();
    expect(service.isDropValid(game, club(5), { prop: 'solvedPiles', index: 1 })).toBeFalse();
    expect(service.isDropValid(game, club(6), { prop: 'solvedPiles', index: 1 })).toBeFalse();

    game = { ...emptyGame(), ...{ solvedPiles: [[heart(8)], [heart(7)]] }, piles: [[], []] };
    expect(service.isDropValid(game, club(13), { prop: 'solvedPiles', index: 1 })).toBeFalse();
    expect(service.isDropValid(game, club(5), { prop: 'solvedPiles', index: 1 })).toBeFalse();
    expect(service.isDropValid(game, club(6), { prop: 'solvedPiles', index: 1 })).toBeTrue();

    expect(service.isDropValid(game, club(13), { prop: 'solvedPiles', index: 99 })).toBeFalse();
  });

  it('should splice a list of cards', () => {
    let game = emptyGame();
    expect(service.spliceCards(game, { prop: 'activeStock' })).toEqual({ game: game, cards: [] });

    game = { ...emptyGame(), ...{ activeStock: [heart(3)] } };
    let result: GameSlots = { ...emptyGame(), ...{ activeStock: [] } };
    expect(service.spliceCards(game, { prop: 'activeStock' })).toEqual({ game: result, cards: [heart(3)] });

    game = { ...emptyGame(), ...{ activeStock: [heart(3), club(4)] } };
    result = { ...emptyGame(), ...{ activeStock: [heart(3)] } };
    expect(service.spliceCards(game, { prop: 'activeStock' })).toEqual({ game: result, cards: [club(4)] });

    game = { ...emptyGame(), ...{ foundations: [[], [], [], []] } };
    result = { ...emptyGame(), ...{ foundations: [[], [], [], []] } };
    expect(service.spliceCards(game, { prop: 'foundations', pileIndex: 2 })).toEqual({ game: result, cards: [] });

    game = { ...emptyGame(), ...{ foundations: [[], [diamond(6)], [], [heart(1), heart(2)]] } };
    result = { ...emptyGame(), ...{ foundations: [[], [diamond(6)], [], [heart(1), heart(2)]] } };
    expect(service.spliceCards(game, { prop: 'foundations', pileIndex: 2 })).toEqual({ game: result, cards: [] });

    result = { ...emptyGame(), ...{ foundations: [[], [], [], [heart(1), heart(2)]] } };
    expect(service.spliceCards(game, { prop: 'foundations', pileIndex: 1 })).toEqual({ game: result, cards: [diamond(6)] });

    result = { ...emptyGame(), ...{ foundations: [[], [diamond(6)], [], [heart(1)]] } };
    expect(service.spliceCards(game, { prop: 'foundations', pileIndex: 3 })).toEqual({ game: result, cards: [heart(2)] });

    game = { ...emptyGame(), ...{ piles: [[], [], [], []], solvedPiles: [[], [diamond(6)], [], [heart(1), heart(2)]] } };
    result = { ...emptyGame(), ...{ piles: [[], [], [], []], solvedPiles: [[], [diamond(6)], [], []] } };
    expect(service.spliceCards(game, { prop: 'solvedPiles', pileIndex: 3, cardIndex: 0 })).toEqual({ game: result, cards: [heart(1), heart(2)] });
  });

  it('should fold the stock', () => {
    let game = emptyGame();
    expect(service.solveStock(game)).toEqual({ ...game });

    game = { ...emptyGame(), ...{ stock: [diamond(2)] } };
    expect(service.solveStock(game)).toEqual({ ...game, ...{ stock: [], activeStock: [diamond(2)] } });

    game = { ...emptyGame(), ...{ stock: [diamond(2), heart(1)] } };
    expect(service.solveStock(game)).toEqual({ ...game, ...{ stock: [diamond(2)], activeStock: [heart(1)] } });

    game = { ...emptyGame(), ...{ stock: [], activeStock: [heart(4), heart(6)] } };
    expect(service.solveStock(game)).toEqual({ ...game, ...{ stock: [heart(6), heart(4)], activeStock: [] } });

    game = { ...emptyGame(), ...{ stock: [club(3), spade(4)], activeStock: [heart(4), heart(6)] } };
    expect(service.solveStock(game)).toEqual({ ...game, ...{ stock: [club(3)], activeStock: [heart(4), heart(6), spade(4)] } });
  });

  it('should play a copy of a real game', () => {
    let game: GameSlots = emptyGame();
    let snapshot: GameSlots = cloneGame(game);
    game.foundations = [[], [], [], []];
    game.piles = [
      [],
      [club(13)],
      [heart(4)],
      [spade(10)],
      [spade(13), club(9), club(12), heart(2)],
      [],
      [spade(12), club(1)],
    ];
    game.stock = [
      diamond(9), heart(7), heart(12), heart(5),
    ];
    game.solvedPiles = [
      [diamond(10)],
      [heart(13)],
      [heart(1)],
      [club(11)],
      [spade(1)],
      [diamond(3)],
      [heart(8)],
    ];

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 2 });

    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations[0]).toEqual([heart(1)]);
    expect(game.solvedPiles[2]).toEqual([heart(4)]);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 4 });
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations[1]).toEqual([spade(1)]);
    expect(game.solvedPiles[4]).toEqual([heart(2)]);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 4 });
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations[0]).toEqual([heart(1), heart(2)]);
    expect(game.solvedPiles[4]).toEqual([club(12)]);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 4 });
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations).toEqual(snapshot.foundations)
    expect(game.solvedPiles[1]).toEqual([heart(13), club(12)]);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 6 });
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.solvedPiles[4]).toEqual([club(9), heart(8)]);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 6 });
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.foundations[2]).toEqual([club(1)]);
    expect(game.solvedPiles).not.toEqual(snapshot.solvedPiles);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 5 }); //not allowed
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.solvedPiles).toEqual(snapshot.solvedPiles);

    snapshot = cloneGame(game);
    game = service.solveStock(game);
    expect(game.activeStock).toEqual([heart(5)]);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.stock).not.toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.solvedPiles).toEqual(snapshot.solvedPiles);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 0 });
    expect(game.solvedPiles[0]).toEqual([]);
    expect(game.solvedPiles[3]).toEqual([club(11), diamond(10)]);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 1, cardIndex: 0 }, { prop: 'solvedPiles', index: 0 });
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.solvedPiles[0]).toEqual([heart(13), club(12)]);
    expect(game.piles[1]).toEqual([]);
    expect(game.solvedPiles[1]).toEqual([club(13)]);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 4, cardIndex: 0 });
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.solvedPiles[3]).toEqual([club(11), diamond(10), club(9), heart(8)]);
    expect(game.piles[4]).toEqual([]);
    expect(game.solvedPiles[4]).toEqual([spade(13)]);

    snapshot = cloneGame(game);
    game = service.solveStock(game);
    expect(game.activeStock).toEqual([heart(5), heart(12)]);
    expect(game.stock).not.toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.solvedPiles).toEqual(snapshot.solvedPiles);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'activeStock' }, { prop: 'solvedPiles', index: 1 });
    expect(game.activeStock).toEqual([heart(5)]);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.solvedPiles).not.toEqual(snapshot.solvedPiles);
    expect(game.solvedPiles[1]).toEqual([club(13), heart(12)]);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'solvedPiles', pileIndex: 3, cardIndex: 0 });
    expect(game.activeStock).toEqual(snapshot.activeStock);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.piles).not.toEqual(snapshot.piles);
    expect(game.solvedPiles).not.toEqual(snapshot.solvedPiles);
    expect(game.solvedPiles[3]).toEqual([spade(10)]);
    expect(game.solvedPiles[1]).toEqual([club(13), heart(12), club(11), diamond(10), club(9), heart(8)]);

    snapshot = cloneGame(game);
    game = service.solveStock(game);
    expect(game.activeStock).toEqual([heart(5), heart(7)]);
    expect(game.stock).not.toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.solvedPiles).toEqual(snapshot.solvedPiles);

    snapshot = cloneGame(game);
    game = service.solveStock(game);
    expect(game.activeStock).toEqual([heart(5), heart(7), diamond(9)]);
    expect(game.stock).not.toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.solvedPiles).toEqual(snapshot.solvedPiles);

    snapshot = cloneGame(game);
    game = service.solve(game, { prop: 'activeStock' });
    expect(game.activeStock).toEqual([heart(5), heart(7)]);
    expect(game.stock).toEqual(snapshot.stock);
    expect(game.foundations).toEqual(snapshot.foundations);
    expect(game.piles).toEqual(snapshot.piles);
    expect(game.solvedPiles).not.toEqual(snapshot.solvedPiles);
    expect(game.solvedPiles[3]).toEqual([spade(10), diamond(9)]);
  });
});
