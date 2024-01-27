import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AnyObject, Card, GameSlots } from '../../types';
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
      this.setGameSlots(this.deckService.generateGame());
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

  getLastCard(...piles: Card[][]): Card | null {
    return this.deckService.getLastCardFromPiles(...piles);
  }

  solvePile(index: number): void {
    const moved = this.solveSection('solvedPiles', index);
    if (!moved && this.piles[index].length > 0) { // move the card on same pile to the solved
      this.solvedPiles[index].push(this.piles[index].pop()!);
      this.solvedPiles[index] = [...this.solvedPiles[index]];
      this.piles[index] = [...this.piles[index]];
    }
  }

  solveSection(prop: 'solvedPiles' | 'foundations', index: number): boolean {
    const pileLength = this[prop][index].length;
    if (pileLength > 0) {
      const result = this.deckService.solveCard(this.getGameSlots(), this[prop][index][pileLength - 1]);
      if (result.moved) {
        this.setGameSlots(result);
        this[prop][index].pop();
        this[prop][index] = [...this[prop][index]];
        return true;
      }
    }
    return false;
  }

  solveActiveStock(): void {
    const stockLength = this.activeStock.length;
    if (stockLength > 0) {
      const result = this.deckService.solveCard(this.getGameSlots(), this.activeStock[stockLength - 1]);
      if (result.moved) {
        this.setGameSlots(result);
        this.activeStock.pop();
        this.activeStock = [...this.activeStock];
      }
    }
  }

  getGameSlots(): GameSlots {
    return {
      stock: this.stock,
      activeStock: this.activeStock,
      piles: this.piles,
      solvedPiles: this.solvedPiles,
      foundations: this.foundations,
    };
  }

  setGameSlots(slots: GameSlots): void {
    this.stock = slots.stock;
    this.activeStock = slots.activeStock;
    this.piles = slots.piles;
    this.solvedPiles = slots.solvedPiles;
    this.foundations = slots.foundations;
  }
}
