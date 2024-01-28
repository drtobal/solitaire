import { Injectable } from '@angular/core';

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
}
