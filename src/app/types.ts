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

export type GameTakeableStock = keyof Pick<GameSlots, 'activeStock' | 'solvedPiles' | 'foundations' | 'stock'>;

export interface GameMoved extends GameSlots {
    moved: boolean;
}
