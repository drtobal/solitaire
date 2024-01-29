import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../types';
import { CardComponent } from '../card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

/** displays a pile of cards, folded or visible */
@Component({
  selector: 'app-pile',
  standalone: true,
  imports: [CommonModule, CardComponent, DragDropModule],
  templateUrl: './pile.component.html',
  styleUrl: './pile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PileComponent {
  /** cards of the pile */
  @Input() cards: Card[] = [];

  /** check if cards must display stacked one over other or not */
  @Input() stacked: boolean = true;

  /** check if cards are visible */
  @Input() visible: boolean = false;

  /** check if this pile has a drop container */
  @Input() hasDrop: boolean = false;

  /** check if this pile has placeholder for when it is empty */
  @Input() placeholder: boolean = true;

  /** check if this pile has drag disabled */
  @Input() dragDisabled: boolean = false;

  /** check if this pile has drop disabled */
  @Input() dropDisabled: boolean = false;

  /** event emitted when user clicks a card, giving the index of the card clicked */
  @Output() clickCard = new EventEmitter<number>();

  /** emits to parent when user has started dragging some cards, given the index of the first card dragged */
  @Output() dragStarted = new EventEmitter<number>();

  /** emits to parent when user has ended dragging */
  @Output() dragEnded = new EventEmitter<void>();

  /** emits to parent when the user has dropped some cards in this pile */
  @Output() dropped = new EventEmitter<void>();

  /** index of the card dragging just to hide or show cards on this pile */
  dragIndex: number = -1;

  /** return the last card of this pile */
  getLastCard(): Card {
    return this.cards[this.cards.length - 1];
  }

  /** set drag index prop and emits event */
  cdkDragStarted(index: number): void {
    this.dragIndex = index;
    this.dragStarted.emit(index);
  }

  /** clear drag index prop and emits event */
  cdkDragEnded(): void {
    this.dragIndex = -1;
    this.dragEnded.emit();
  }
}
