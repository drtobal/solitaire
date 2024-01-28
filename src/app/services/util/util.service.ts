import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  async wait(time: number): Promise<void> {
    return new Promise(success => {
      setTimeout(success, time);
    });
  }
}
