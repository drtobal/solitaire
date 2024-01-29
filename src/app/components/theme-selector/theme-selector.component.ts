import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CardTheme } from '../../types';
import { CARD_THEMES, DEFAULT_THEME } from '../../constants';
import { ConfigService } from '../../services/config/config.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

/** this is just a selector for chage the theme of the cards */
@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {
  /** list of themes */
  themes: CardTheme[] = CARD_THEMES;

  /** current used theme */
  current: CardTheme = DEFAULT_THEME;

  /** subscription to theme changes */
  themeSub?: Subscription;

  /** component constructor */
  constructor(
    private configService: ConfigService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { /* do nothing */ }

  /** set up */
  ngOnInit(): void {
    this.themeSub = this.configService.cardTheme.subscribe(this.onCardTheme.bind(this));
  }

  /** clean up */
  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  /** update current theme when changes from outside */
  onCardTheme(cardTheme: CardTheme): void {
    this.current = cardTheme;
    this.changeDetectorRef.detectChanges();
  }

  /** set up given theme to game */
  onChange(theme: CardTheme): void {
    this.configService.cardTheme.next(theme);
  }
}
