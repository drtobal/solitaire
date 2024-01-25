import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CARD_SPACE } from '../../constants';
import { AnyObject, Card } from '../../types';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-pile',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './pile.component.html',
  styleUrl: './pile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PileComponent {
  @Input() cards: Card[] = [];

  @Input() stacked: boolean = true;

  @Input() visible: boolean = false;

  getLastCard(): Card {
    return this.cards[this.cards.length - 1];
  }

  getCardStyle(index: number): AnyObject {
    return {
      top: `${CARD_SPACE * index}rem`,
    };
  }
}
