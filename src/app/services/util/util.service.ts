import { Injectable } from '@angular/core';

/** just some global util fucntions */
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  /** wait a custom time, this could be useful for chain movements and animations */
  async wait(time: number): Promise<void> {
    return new Promise(success => setTimeout(success, time));
  }

  /** get offset position of given html element from screen */
  getOffset(element: HTMLElement): { left: number, top: number } {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  }

  /** deep clone a entire object, be careful with objects that have functions or are recursive */
  static deepClone<T>(obj: T, _structuredClone: (d: T) => T = structuredClone): T {
    if (typeof _structuredClone === 'function') {
      return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
  }
}
