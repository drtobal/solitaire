import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AnyObject, Card } from '../../types';
import { DeckService } from '../../services/deck/deck.service';
import { PileComponent } from '../pile/pile.component';
import { CARD_SPACE } from '../../constants';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PileComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  /** check if the code is running in server side or browser */
  isBrowser: boolean = false;

  stock: Card[] = [];

  activeStock: Card[] = [];

  piles: Card[][] = [];

  solvedPiles: Card[][] = [];

  foundations: Card[][] = [];

  constructor(
    private deckService: DeckService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const game = this.deckService.generateGame();
      this.stock = game.stock;
      this.activeStock = game.activeStock;
      this.piles = game.piles;
      this.solvedPiles = game.solvedPiles;
      this.foundations = game.foundations;
    }
  }

  getSolvedPileStyle(offset: number): AnyObject {
    return { top: `${offset * CARD_SPACE}rem` };
  }

  takeStock(): void {
    if (this.stock.length > 0) {
      const card = this.stock.shift();
      if (card) {
        this.activeStock.push(card);
      }

      this.stock = [...this.stock];
      this.activeStock = [...this.activeStock];
    } else {
      this.stock = [...this.activeStock];
      this.activeStock = [];
    }

    this.changeDetectorRef.detectChanges();
  }
}
