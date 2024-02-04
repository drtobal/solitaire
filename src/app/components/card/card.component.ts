import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CardTypeL, DEFAULT_THEME } from '../../constants';
import { AnyObject, Card, CardTheme, Coords2D } from '../../types';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config/config.service';

/** vertical gap for card background image used as tiles photo */
const VER_GAP = 4;

/** horizontal gap for card background image used as tiles photo */
const HOR_GAP = 24;

/** card width for card background image used as tiles photo */
const CARD_WIDTH = 40;

/** card height for card background image used as tiles photo */
const CARD_HEIGHT = 60;

/** displays a card both faces */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit, OnDestroy {
  /** card to display */
  @Input() card?: Card;

  /** show backface if it's not visible */
  @Input() visible: boolean = false;

  /** list of card types */
  cardTypes = CardTypeL;

  /** subscription to theme changes */
  themeSub?: Subscription;

  /** current theme applied to cards */
  cardTheme: CardTheme = DEFAULT_THEME;

  /** component constructor */
  constructor(
    private configService: ConfigService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { /* do nothing */ }

  /** set up */
  ngOnInit(): void {
    this.themeSub = this.configService.cardTheme.subscribe(this.onCardTheme.bind(this));
  }

  /** clean up */
  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  /** update card theme on card theme is updated in config service */
  onCardTheme(cardTheme: CardTheme): void {
    this.cardTheme = cardTheme;
    this.changeDetectorRef.detectChanges();
  }

  /** generate css styles for each card, each card has unique css styles since all of them are in one photo */
  getCardStyle(card?: Card): AnyObject {
    const coords = this.getTypeCoords(card);
    return {
      'background-image': `url(/assets/cards/${this.cardTheme.source}.png)`,
      'background-position': `-${coords.x}px -${coords.y}px`,
    };
  }

  /** generate 2d coordinates to find the card in the image containing all cards */
  getTypeCoords(card?: Card): Coords2D {
    if (card) {
      return this.getCoordsToPx({ x: card.number, y: this.getRowPosition(card) });
    }
    return this.getCoordsToPx({ x: 14, y: 4 }); // this is the backface
  }

  /** convert the 2d coords position of the card into pixels */
  getCoordsToPx(coords: Coords2D): Coords2D {
    return {
      x: (CARD_WIDTH * (coords.x - 1)) + (HOR_GAP * (coords.x - 1)),
      y: (CARD_HEIGHT * (coords.y - 1)) + (VER_GAP * (coords.y - 1)),
    };
  }

  /** return the row of the given kind of card, they must match with the image containing all cards */
  getRowPosition(card?: Card): number {
    if (card) {
      switch (card.type) {
        case CardTypeL.club:
          return 3;
        case CardTypeL.diamond:
          return 4;
        case CardTypeL.heart:
          return 2;
        case CardTypeL.spade:
          return 1;
      }
    }
    return 4;
  }
}
