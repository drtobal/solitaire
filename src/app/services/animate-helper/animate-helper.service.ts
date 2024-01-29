import { Injectable } from '@angular/core';
import { REM_PX } from '../../constants';
import { AnyObject, SolveFrom, SolveTo } from '../../types';
import { UtilService } from '../util/util.service';

/** just som helper functions to cards animations */
@Injectable({
  providedIn: 'root'
})
export class AnimateHelperService {
  /** service constructor */
  constructor(
    private utilService: UtilService,
  ) { /* do nothing */ }

  /** get html element used as a source of the animation */
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

  /** get html element used as a target of the animation */
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

  /** reutnr the top and left position of the given element, using vertical gap as optional */
  getElementPositionStyles(targetElement?: HTMLElement | null, gap: number = 0): AnyObject {
    if (targetElement) {
      const position = this.utilService.getOffset(targetElement as HTMLElement);
      return { top: `${position.top + gap}px`, left: `${position.left}px` };
    }
    return {};
  }

  /** get position of the element of string selector */
  getCardStyleCustom(element: HTMLElement, selector: string): AnyObject {
    return this.getElementPositionStyles(element.querySelector(selector) as HTMLElement);
  }

  /** get position fo element which is used as a start point */
  getCardStartStyle(element: HTMLElement, from: SolveFrom): AnyObject {
    return this.getElementPositionStyles(this.getElementFrom(element, from));
  }

  /** get position fo element which is used as a end point */
  getCardEndStyle(element: HTMLElement, to: SolveTo): AnyObject {
    return this.getElementPositionStyles(this.getElementTo(element, to), 1.25 * REM_PX);
  }
}
