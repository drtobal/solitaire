import { TestBed } from '@angular/core/testing';

import { AnimateHelperService } from './animate-helper.service';

describe('AnimateHelperService', () => {
  let service: AnimateHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimateHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
