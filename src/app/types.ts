export type AnyObject = {
    [prop: string]: any;
};

export type CardColor = 'red' | 'black';

export type CardNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type CardType = 'heart' | 'spade' | 'diamond' | 'club';

export type Card = {
    type: CardType;
    color: CardColor;
    number: CardNumber;
};

export type GameSlots = {
    stock: Card[],
    activeStock: Card[],
    solvedPiles: Card[][],
    piles: Card[][],
    foundations: Card[][],
};
