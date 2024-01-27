import { DeckDefinition } from "./types";

export const DECK_SIZE = 13;

export const PILES = 7;

export const CARD_SPACE = 0.25;

export enum CardTypeL {
    club = 'club',
    diamond = 'diamond',
    heart = 'heart',
    spade = 'spade',
};

export enum CardColorL {
    black = 'black',
    red = 'red',
};

export const DECKS: DeckDefinition[] = [
    { color: CardColorL.black, type: CardTypeL.club },
    { color: CardColorL.red, type: CardTypeL.diamond },
    { color: CardColorL.black, type: CardTypeL.spade },
    { color: CardColorL.red, type: CardTypeL.heart },
];

export const CARD_TYPES = [CardTypeL.club, CardTypeL.diamond, CardTypeL.heart, CardTypeL.spade];

export const CARD_COLORS = [CardColorL.black, CardColorL.red];
