import { TestBed } from '@angular/core/testing';

import { MatchServ } from './matchServ';

describe('MatchServ', () => {
  let service: MatchServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
