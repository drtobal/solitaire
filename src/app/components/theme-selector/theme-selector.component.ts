import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CardTheme } from '../../types';
import { CARD_THEMES, DEFAULT_THEME } from '../../constants';
import { ConfigService } from '../../services/config/config.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {
  themes: CardTheme[] = CARD_THEMES;

  current: CardTheme = DEFAULT_THEME;

  themeSub?: Subscription;

  /** component constructor */
  constructor(
    private configService: ConfigService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { /* do nothing */ }

  ngOnInit(): void {
    this.themeSub = this.configService.cardTheme.subscribe(this.onCardTheme.bind(this));
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  onCardTheme(cardTheme: CardTheme): void {
    this.current = cardTheme;
    this.changeDetectorRef.detectChanges();
  }

  onChange(theme: CardTheme): void {
    this.configService.cardTheme.next(theme);
  }
}
