import { Injectable } from '@angular/core';
import { REM_PX } from '../../constants';
import { AnyObject, SolveFrom, SolveTo } from '../../types';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root'
})
export class AnimateHelperService {
  /** service constructor */
  constructor(
    private utilService: UtilService,
  ) { /* do nothing */ }

  getElementFrom(root: HTMLElement, from: SolveFrom): HTMLElement | null {
    switch (from.prop) {
      case 'activeStock':
        return root.querySelector('app-pile.active-stock > div:first-child') ||
          root.querySelector('app-pile.active-stock');
      case 'foundations':
        return root.querySelector(`app-pile.foundation.index-${from.pileIndex} > div:last-child`) ||
          root.querySelector(`app-pile.foundation.index-${from.pileIndex}`);
      case 'solvedPiles':
        return root.querySelector(`app-pile.solved-pile.index-${from.pileIndex} > div:last-child`)
          || root.querySelector(`app-pile.solved-pile.index-${from.pileIndex}`);
    }
  }

  getElementTo(root: HTMLElement, to: SolveTo): HTMLElement | null {
    switch (to.prop) {
      case 'foundations':
        return root.querySelector(`app-pile.foundation.index-${to.index} > div:last-child`) ||
          root.querySelector(`app-pile.foundation.index-${to.index}`);
      case 'solvedPiles':
        return root.querySelector(`app-pile.solved-pile.index-${to.index} > div:last-child`) ||
          root.querySelector(`app-pile.solved-pile.index-${to.index}`);
    }
  }

  getCardStartStyle(element: HTMLElement, from: SolveFrom): AnyObject {
    const styles: AnyObject = {};
    const targetElement = this.getElementFrom(element, from);
    if (targetElement) {
      const position = this.utilService.getOffset(targetElement);
      styles['top'] = `${position.top}px`;
      styles['left'] = `${position.left}px`;
    }
    return styles;
  }

  getCardEndStyle(element: HTMLElement, to: SolveTo): AnyObject {
    const styles: AnyObject = {};
    const targetElement = this.getElementTo(element, to);
    if (targetElement) {
      const position = this.utilService.getOffset(targetElement);
      styles['top'] = `${position.top + REM_PX}px`;
      styles['left'] = `${position.left + REM_PX}px`;
    }
    return styles;
  }
}
