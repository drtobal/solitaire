import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AnyObject, Card, GameSlots, SolveFrom, SolveTo } from '../../types';
import { DeckService } from '../../services/deck/deck.service';
import { PileComponent } from '../pile/pile.component';
import { CARD_SPACE } from '../../constants';
import { GameService } from '../../services/game/game.service';
import { UtilService } from '../../services/util/util.service';
import { AnimateHelperService } from '../../services/animate-helper/animate-helper.service';

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

  animatingCards: Card[] = [];

  animatingStyle: AnyObject = {};

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

  solveStock(): void {
    this.setGameSlots(this.deckService.solveStock(this.getGameSlots()));
    this.changeDetectorRef.detectChanges();
  }

  canAutoSolve(): boolean {
    return this.gameService.hasPiles(this.getGameSlots());
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

  getSolvedPileStyle(offset: number): AnyObject {
    return { top: `${offset * CARD_SPACE}rem` };
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
