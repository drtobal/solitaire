import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input() gap: number = 0;

  @Output() clickCard = new EventEmitter<number>();

  getLastCard(): Card {
    return this.cards[this.cards.length - 1];
  }

  getCardStyle(index: number): AnyObject {
    return {
      top: `${(CARD_SPACE + this.gap) * index}rem`,
    };
  }
}
