import { TestBed } from '@angular/core/testing';

import { Swipe } from './swipe';

describe('Swipe', () => {
  let service: Swipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Swipe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
