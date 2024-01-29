import { CardTheme, DeckDefinition } from "./types";

export const DECK_SIZE = 13;

export const PILES = 7;

export const CARD_SPACE = 1;

export const REM_PX = 16;

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

export const CARD_THEMES: CardTheme[] = [
    { name: 'sepia 1 color', source: 'deck_classic_sepia_1color_0' },
    { name: 'sepia 2 color', source: 'deck_classic_sepia_2color_0' },
    { name: 'dark 1 color', source: 'deck_classic_dark_1color_0' },
    { name: 'dark 2 color', source: 'deck_classic_dark_2color_0' },
    { name: 'light 1 color', source: 'deck_classic_light_1color_0' },
    { name: 'light 2 color', source: 'deck_classic_light_2color_0' },
    { name: 'light 4 color A', source: 'deck_classic_light_4color_0' },
    { name: 'light 4 color B', source: 'deck_classic_light_4color_1' },
    { name: 'light 4 color C', source: 'deck_classic_light_4color_2' },
];

export const DEFAULT_THEME = CARD_THEMES[5];
