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
        return root.querySelector('app-pile.active-stock') ||
          root.querySelector('app-pile.active-stock');
      case 'foundations':
        return root.querySelector(`app-pile.foundation.index-${from.pileIndex} > div:nth-child(${from.cardIndex})`) ||
          root.querySelector(`app-pile.foundation.index-${from.pileIndex}`);
      case 'solvedPiles':
        return root.querySelector(`app-pile.solved-pile.index-${from.pileIndex} > div:nth-child(${from.cardIndex})`)
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

  getElementPositionStyles(targetElement?: HTMLElement | null): AnyObject {
    if (targetElement) {
      const position = this.utilService.getOffset(targetElement as HTMLElement);
      return { top: `${position.top}px`, left: `${position.left}px` };
    }
    return {};
  }

  getCardStyleCustom(element: HTMLElement, selector: string): AnyObject {
    return this.getElementPositionStyles(element.querySelector(selector) as HTMLElement);
  }

  getCardStartStyle(element: HTMLElement, from: SolveFrom): AnyObject {
    return this.getElementPositionStyles(this.getElementFrom(element, from));
  }

  getCardEndStyle(element: HTMLElement, to: SolveTo): AnyObject {
    return this.getElementPositionStyles(this.getElementTo(element, to));
  }
}
