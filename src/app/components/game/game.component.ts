import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Card, Foundations, Piles } from '../../types';
import { DeckService } from '../../services/deck/deck.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  /** check if the code is running in server side or browser */
  isBrowser: boolean = false;

  stock: Card[] = [];

  activeStock: Card[] = [];

  piles: Piles = [[], [], [], [], [], [], []];

  foundatinos: Foundations = [[], [], [], []];

  constructor(
    private deckService: DeckService,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      console.log(this.deckService.generateDecks());
    }
  }
}
