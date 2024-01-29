import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardTypeL } from '../../constants';
import { AnyObject, Card, Coords2D } from '../../types';

const VER_GAP = 4;

const HOR_GAP = 24;

const CARD_WIDTH = 40;

const CARD_HEIGHT = 60;

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() card?: Card;

  @Input() visible: boolean = false;

  cardTypes = CardTypeL;

  getCardStyle(card?: Card): AnyObject {
    const coords = this.getTypeCoords(card);
    return {
      'background-image': `url(/assets/cards/deck_classic_light_2color_1.png)`,
      'background-position': `-${coords.x}px -${coords.y}px`,
    };
  }

  getTypeCoords(card?: Card): Coords2D {
    if (card) {
      return this.getCoordsToPx({ x: card.number, y: this.getColumnPosition(card) });
    }
    return this.getCoordsToPx({ x: 14, y: 4 });
  }

  getCoordsToPx(coords: Coords2D): Coords2D {
    return {
      x: (CARD_WIDTH * (coords.x - 1)) + (HOR_GAP * (coords.x - 1)),
      y: (CARD_HEIGHT * (coords.y - 1)) + (VER_GAP * (coords.y - 1)),
    };
  }

  getColumnPosition(card?: Card): number {
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
