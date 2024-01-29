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
import { ConfigService } from '../../services/config/config.service';
import { FooterComponent } from '../footer/footer.component';

/** main game component, this component apply functios to every component needed to play */
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PileComponent, DragDropModule, ThemeSelectorComponent, FooterComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  providers: [ConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  /** check if the code is running in server side or browser */
  isBrowser: boolean = false;

  /** cards of stock pile */
  stock: Card[] = [];

  /** cards of active stock pile */
  activeStock: Card[] = [];

  /** folded piles */
  piles: Card[][] = [];

  /** visible piles */
  solvedPiles: Card[][] = [];

  /** four foundations of the game */
  foundations: Card[][] = [];

  /** copy of cards that are currently animating */
  animatingCards: Card[] = [];

  /** just css properties to animate cards */
  animatingStyle: AnyObject = {};

  /** from data needed to solve a movement assigned when starts dragging */
  dragFrom: SolveFrom | null = null;

  /** check if game is ended, when all piles are solved */
  isGameEnded: boolean = false;

  /** snapshots of previous versoins of the game to allow user to undo a movement */
  snapshots: GameSlots[] = [];

  /** movements counting */
  movements: number = 0;

  /** component constructor */
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

  /** set up the game */
  ngOnInit(): void {
    if (this.isBrowser) {
      const game = this.deckService.generateGame();
      this.setGameSlots(game);
      this.snapshots.push(UtilService.deepClone(game));
    }
  }

  /** solve a movement and triggers an animation of the card(s) being solved */
  async solveWithAnimation(from: SolveFrom, to: SolveTo | null = null): Promise<void> {
    const snapshot = UtilService.deepClone(this.getGameSlots());
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
      this.movements++;
    }
    this.setGameSlots(solvedGame);
    this.isGameEnded = this.gameService.isGameEnded(solvedGame);
    this.snapshots.push(snapshot);
    this.changeDetectorRef.detectChanges();
  }

  /** solve from a solved pile */
  moveSolvedPile(pileIndex: number, cardIndex: number): void {
    this.solveWithAnimation({ prop: 'solvedPiles', pileIndex, cardIndex });
  }

  /** solve from acitive stock pile */
  solveActiveStock(): void {
    this.solveWithAnimation({ prop: 'activeStock' });
  }

  /** solve from a foundation pile */
  solveFoundation(pileIndex: number): void {
    this.solveWithAnimation({ prop: 'foundations', pileIndex });
  }

  /** solve stock, can fold it or reverse all the active stock */
  async solveStock(): Promise<void> {
    const snapshot = UtilService.deepClone(this.getGameSlots());
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
    this.snapshots.push(snapshot);
    this.movements++;
    this.changeDetectorRef.detectChanges();
  }

  /** check if the game can be auto completed, not implemented yet */
  // canAutoSolve(): boolean {
  //   return this.gameService.hasPiles(this.getGameSlots());
  // }

  /** assign some data whe user starts dragging some cards */
  dragStarted(data: SolveFrom): void {
    this.dragFrom = data;
    this.changeDetectorRef.detectChanges();
  }

  /** try to solve the dropped cards */
  dropped(solveTo: SolveTo): void {
    if (this.dragFrom) {
      const snapshot = UtilService.deepClone(this.getGameSlots());
      const solvedGame = this.deckService.solve(this.getGameSlots(), this.dragFrom, solveTo);
      if (solvedGame.moved) {
        this.setGameSlots(solvedGame);
        this.snapshots.push(snapshot);
        this.movements++;
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  /** clear data when user end the dragging function */
  dragEnded(): void {
    setTimeout(() => { // allow to fire drop before clean
      this.dragFrom = null;
      this.changeDetectorRef.detectChanges();
    }, 10);
  }

  /** auto complete all cards left, not implemented yet */
  // async autoSolve(): Promise<void> {
  //   let game = this.getGameSlots();
  //   let loop = 0;
  //   const limit = 99;
  //   while (++loop < limit && !this.gameService.isGameEnded(game)) {
  //     await this.utilService.wait(50);
  //     game = this.gameService.solveNext(game);
  //     this.setGameSlots(JSON.parse(JSON.stringify(game)));
  //     this.changeDetectorRef.detectChanges();
  //   }
  // }

  /** transform current game into a slots format to apply functions */
  getGameSlots(): GameSlots {
    return {
      stock: this.stock,
      activeStock: this.activeStock,
      piles: this.piles,
      solvedPiles: this.solvedPiles,
      foundations: this.foundations,
    };
  }

  /** set to playing game from a object game */
  setGameSlots(slots: GameSlots): void {
    this.stock = slots.stock;
    this.activeStock = slots.activeStock;
    this.piles = slots.piles;
    this.solvedPiles = slots.solvedPiles;
    this.foundations = slots.foundations;
  }

  /** undo movement function */
  undo(): void {
    if (this.snapshots.length === 1) {
      this.setGameSlots(UtilService.deepClone(this.snapshots.slice(-1)[0])); // start of the game
    } else {
      const game = this.snapshots.pop();
      if (game) {
        this.setGameSlots(game);
      }
    }
    this.movements++;
    this.changeDetectorRef.detectChanges();
  }
}
