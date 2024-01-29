import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardTheme } from '../../types';
import { DEFAULT_THEME } from '../../constants';

/** singleton service to store game configuration */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  /** current game theme */
  private _cardTheme = new BehaviorSubject<CardTheme>(DEFAULT_THEME);

  /** game theme getter */
  get cardTheme(): BehaviorSubject<CardTheme> {
    return this._cardTheme;
  }
}
