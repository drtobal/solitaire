import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AnyObject, Card, GameSlots, SolveFrom, SolveTo } from '../../types';
import { DeckService } from '../../services/deck/deck.service';
import { PileComponent } from '../pile/pile.component';
import { GameService } from '../../services/game/game.service';
import { UtilService } from '../../services/util/util.service';
import { AnimateHelperService } from '../../services/animate-helper/animate-helper.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PileComponent, DragDropModule, ThemeSelectorComponent],
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

  animatingCards: Card[] = [];

  animatingStyle: AnyObject = {};

  dragFrom: SolveFrom | null = null;

  isGameEnded: boolean = false;

  isStockEnded: boolean = false;

  constructor(
    private deckService: DeckService,
    private gameService: GameService,
    private utilService: UtilService,
    private changeDetectorRef: ChangeDetectorRef,
    private animateHelperService: AnimateHelperService,
    readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.setGameSlots(this.deckService.generateGame());
    }
  }

  async solveWithAnimation(from: SolveFrom, to: SolveTo | null = null): Promise<void> {
    const solvedGame = this.deckService.solve(this.getGameSlots(), from, to);
    if (solvedGame.moved && solvedGame.to) { // apply the animation
      this.setGameSlots(solvedGame.spliced.game);
      this.animatingCards = solvedGame.spliced.cards;
      this.animatingStyle = this.animateHelperService.getCardStartStyle(this.elementRef.nativeElement, from);
      this.changeDetectorRef.detectChanges();
      await this.utilService.wait(10);

      this.animatingStyle = this.animateHelperService.getCardEndStyle(this.elementRef.nativeElement, solvedGame.to);
      this.changeDetectorRef.detectChanges();
      await this.utilService.wait(100);

      this.animatingCards = [];
    }
    this.setGameSlots(solvedGame);
    this.isGameEnded = this.gameService.isGameEnded(solvedGame);
    this.isStockEnded = this.gameService.isStockEnded(solvedGame);
    this.changeDetectorRef.detectChanges();
  }

  moveSolvedPile(pileIndex: number, cardIndex: number): void {
    this.solveWithAnimation({ prop: 'solvedPiles', pileIndex, cardIndex });
  }

  solveActiveStock(): void {
    this.solveWithAnimation({ prop: 'activeStock' });
  }

  solveFoundation(pileIndex: number): void {
    this.solveWithAnimation({ prop: 'foundations', pileIndex });
  }

  async solveStock(): Promise<void> {
    const game = this.deckService.solveStock(this.getGameSlots());
    if (this.stock.length > 0) {
      this.animatingCards = this.stock.slice(-1);
      if (this.stock.length === 1) {
        this.stock = [];
      }

      this.animatingStyle = this.animateHelperService.getCardStyleCustom(this.elementRef.nativeElement, 'app-pile.stock');
      this.changeDetectorRef.detectChanges();
      await this.utilService.wait(10);

      this.animatingStyle = this.animateHelperService.getCardStyleCustom(this.elementRef.nativeElement, 'app-pile.active-stock');
      this.changeDetectorRef.detectChanges();
      await this.utilService.wait(100);

      this.animatingCards = [];
    }
    this.setGameSlots(game);
    this.changeDetectorRef.detectChanges();
  }

  canAutoSolve(): boolean {
    return this.gameService.hasPiles(this.getGameSlots());
  }

  dragStarted(data: SolveFrom): void {
    this.dragFrom = data;
    this.changeDetectorRef.detectChanges();
  }

  dropped(solveTo: SolveTo): void {
    if (this.dragFrom) {
      this.setGameSlots(this.deckService.solve(this.getGameSlots(), this.dragFrom, solveTo));
      this.changeDetectorRef.detectChanges();
    }
  }

  dragEnded(): void {
    setTimeout(() => { // allow to fire drop before clean
      this.dragFrom = null;
      this.changeDetectorRef.detectChanges();
    }, 10);
  }

  async autoSolve(): Promise<void> {
    /*let game = this.getGameSlots();
    let loop = 0;
    const limit = 99;
    while (++loop < limit && !this.gameService.isGameEnded(game)) {
      await this.utilService.wait(50);
      game = this.gameService.solveNext(game);
      this.setGameSlots(JSON.parse(JSON.stringify(game)));
      this.changeDetectorRef.detectChanges();
    }*/
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
