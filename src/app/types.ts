export type AnyObject = {
    [prop: string]: any;
};

export type CardColor = 'red' | 'black';

export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type CardType = 'heart' | 'spade' | 'diamond' | 'club';

export type DeckDefinition = {
    type: CardType;
    color: CardColor;
};

export interface Card extends DeckDefinition {
    number: CardNumber;
};

export type GameSlots = {
    stock: Card[],
    activeStock: Card[],
    solvedPiles: Card[][],
    piles: Card[][],
    foundations: Card[][],
};

export type SolveFromStock = {
    prop: keyof Pick<GameSlots, 'activeStock'>;
};

export type SolveFromPile = {
    prop: keyof Pick<GameSlots, 'solvedPiles' | 'foundations'>;
    pileIndex: number;
    cardIndex?: number;
};

export type SolveTo = {
    prop: keyof Pick<GameSlots, 'solvedPiles' | 'foundations'>;
    index: number;
};

export type SolveFrom = SolveFromStock | SolveFromPile;

export type SpliceCards = {
    cards: Card[];
    game: GameSlots;
};

export interface GameMoved extends GameSlots {
    moved: boolean;
}

export interface FullCameMoved extends GameMoved {
    spliced: SpliceCards;
    to?: SolveTo;
}

export type Coords2D = {
    x: number;
    y: number;
}

export type CardTheme = {
    name: string;
    source: string;
};
