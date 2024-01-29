import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardTheme } from '../../types';
import { DEFAULT_THEME } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _cardTheme = new BehaviorSubject<CardTheme>(DEFAULT_THEME);

  get cardTheme(): BehaviorSubject<CardTheme> {
    return this._cardTheme;
  }
}
