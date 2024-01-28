import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CARD_SPACE } from '../../constants';
import { AnyObject, Card } from '../../types';
import { CardComponent } from '../card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-pile',
  standalone: true,
  imports: [CommonModule, CardComponent, DragDropModule],
  templateUrl: './pile.component.html',
  styleUrl: './pile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PileComponent {
  @Input() cards: Card[] = [];

  @Input() stacked: boolean = true;

  @Input() visible: boolean = false;

  @Input() hasDrop: boolean = false;

  @Input() placeholder: boolean = true;

  @Output() clickCard = new EventEmitter<number>();

  @Output() dragStarted = new EventEmitter<number>();

  @Output() dragEnded = new EventEmitter<void>(); 

  dragIndex: number = -1;

  /** component constructor */
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) { /* do nothing */ }

  getLastCard(): Card {
    return this.cards[this.cards.length - 1];
  }

  cdkDragStarted(index: number): void {
    this.dragIndex = index;
    this.dragStarted.emit(index);
  }

  cdkDragEnded(): void {
    this.dragIndex = -1;
    this.dragEnded.emit();
  }

  cdkDropListDropped(event: any): void {
    console.log(event);
  }
}
